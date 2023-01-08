package main

import (
	"archive/zip"
	"fmt"
	"io"
	"log"
	"math"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/cavaliergopher/grab/v3"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// Download patch

// Unzip patch and overwrite

// Update game version with patch number

func (a *App) Download(fileUrl string, basePercent float64, eachFileMaxPercent float64) string {
	client := grab.NewClient()
	req, _ := grab.NewRequest(".", fileUrl)

	// start download
	fmt.Printf("Downloading %v...\n", req.URL())
	resp := client.Do(req)
	fmt.Printf("  %v\n", resp.HTTPResponse.Status)

	// start UI loop
	t := time.NewTicker(100 * time.Millisecond)
	defer t.Stop()

Loop:
	for {
		select {
		case <-t.C:
			progressPercent := 100 * resp.Progress()

			actualProgress := int(math.Round(basePercent + (progressPercent * eachFileMaxPercent)))

			runtime.EventsEmit(a.ctx, "downloadProgress", actualProgress)

		case <-resp.Done:
			actualProgress := int(math.Round(basePercent + eachFileMaxPercent))

			runtime.EventsEmit(a.ctx, "downloadProgress", actualProgress)

			// download is complete
			break Loop
		}
	}

	// check for errors
	if err := resp.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "Download failed: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Download saved to ./%v \n", resp.Filename)

	return resp.Filename
}

func (a *App) Unzip(fileLocation string) {
	// LOCAL TESTING ONLY
	dst := fmt.Sprintf("%s/%s", a.GetBasePath(), "tmp")
	// dst := a.GetBasePath()
	// Load file
	archive, err := zip.OpenReader(fileLocation)
	if err != nil {
		panic(err)
	}
	defer archive.Close()

	// Extract and overwrite files
	for _, f := range archive.File {
		filePath := filepath.Join(dst, f.Name)
		fmt.Println("unzipping file ", filePath)

		if !strings.HasPrefix(filePath, filepath.Clean(dst)+string(os.PathSeparator)) {
			fmt.Println("invalid file path")
			return
		}
		if f.FileInfo().IsDir() {
			fmt.Println("creating directory...")
			os.MkdirAll(filePath, os.ModePerm)
			continue
		}

		if err := os.MkdirAll(filepath.Dir(filePath), os.ModePerm); err != nil {
			panic(err)
		}

		dstFile, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
		if err != nil {
			panic(err)
		}

		fileInArchive, err := f.Open()
		if err != nil {
			panic(err)
		}

		if _, err := io.Copy(dstFile, fileInArchive); err != nil {
			panic(err)
		}

		dstFile.Close()
		fileInArchive.Close()
	}
}

func (a *App) RemovePatchZip(downloadLocation string) {
	e := os.Remove(downloadLocation)
	if e != nil {
		log.Fatal(e)
	}
}

func (a *App) DownloadAndInstallPatch(fileUrl string, patchNumber int, basePercent float64, eachFileMaxPercent float64) {
	runtime.EventsEmit(a.ctx, "currentActionUpdates", fmt.Sprintf("Downloading Patch %v", patchNumber))

	downloadLocation := a.Download(fileUrl, basePercent, eachFileMaxPercent)

	runtime.EventsEmit(a.ctx, "currentActionUpdates", fmt.Sprintf("Unzipping Patch %v", patchNumber))

	// Wait 500ms
	time.Sleep(100 * time.Millisecond)

	a.Unzip(downloadLocation)

	// Update game version
	a.UpdateGameVersion(patchNumber)

	// Delete zip file
	a.RemovePatchZip(downloadLocation)
}

func (a *App) InstallAllPatches(patches []string, patchNumbers []int) {
	eachFileMaxPercent := 100.0 / float64(len(patches))

	for index, patch := range patches {
		basePercent := float64(index) * eachFileMaxPercent

		a.DownloadAndInstallPatch(patch, patchNumbers[index], basePercent, eachFileMaxPercent)
	}
}

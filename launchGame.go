package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) LaunchGame() {
	// Fetch app path (launcher will be in main path this time)
	exeName := "Nostalgia.exe"

	path, err := os.Getwd()
	if err != nil {
		log.Println(err)
		return
	}
	runtime.LogInfo(a.ctx, path)

	fullPath := fmt.Sprintf("%s/%s", path, exeName)

	cmd := exec.Command(fullPath, "!RepentLauncher~#")

	cmdErr := cmd.Run()

	if cmdErr != nil {
		runtime.LogError(a.ctx, "Error occured launching game \n")
		runtime.LogFatal(a.ctx, err.Error())
	}

	cmd.Process.Release()

	a.CloseApp()
}

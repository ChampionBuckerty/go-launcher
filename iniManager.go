package main

import (
	"fmt"
	"log"
	"os"
	"regexp"
	"strconv"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) GetBasePath() string {
	path, _ := os.Getwd()

	return path
}

func (a *App) NostalgiaIniPath() (string, error) {
	path := a.GetBasePath()

	return fmt.Sprintf("%s/%s", path, "nostalgia.ini"), nil
}

func (a *App) OptionIniPath() (string, error) {
	path := a.GetBasePath()

	return fmt.Sprintf("%s/%s", path, "option.ini"), nil
}

func (a *App) FetchGameVersion() int {
	path, _ := a.NostalgiaIniPath()

	// Open nostalgia ini
	data, err := os.ReadFile(path)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return 0
	}

	fileData := string(data)

	// Use version regex to fetch the version
	r, _ := regexp.Compile("VERSION=.*")
	results := r.FindString(fileData)

	split := strings.Split(results, "=")

	intVar, intErr := strconv.Atoi(split[1])
	if intErr != nil {
		runtime.LogError(a.ctx, intErr.Error())
		return 0
	}

	// Return version as int
	return intVar
}

func (a *App) UpdateGameVersion(version int) {
	path, _ := a.NostalgiaIniPath()

	// multi line string
	fileText := `[ARES]
VERSION=%v

[NOSTALGIA]
VERSION=%v

`

	formattedText := fmt.Sprintf(fileText, version, version)

	// Overwrite ini file with this text
	f, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0755)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	f.WriteString(formattedText)
}

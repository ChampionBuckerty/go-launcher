package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"regexp"
	"strconv"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type NostalgiaCustomSettings struct {
	AltToggle bool `db:"-" json:"ALTTOGGLE"`
	CustomRes bool `db:"-" json:"CUSTOMRES"`
	Width     int  `db:"-" json:"WIDTH"`
	Height    int  `db:"-" json:"HEIGHT"`
}

func (a *App) GetBasePath() string {
	path, _ := os.Getwd()

	return path
}

func (a *App) NostalgiaSettingsJsonPath() (string, error) {
	path := a.GetBasePath()

	return fmt.Sprintf("%s/%s", path, "NostalgiaSettings.json"), nil
}

func (a *App) NostalgiaIniPath() (string, error) {
	path := a.GetBasePath()

	return fmt.Sprintf("%s/%s", path, "nostalgia.ini"), nil
}

func (a *App) OptionIniPath() (string, error) {
	path := a.GetBasePath()

	return fmt.Sprintf("%s/%s", path, "option.ini"), nil
}

func (a *App) ReadNostalgiaSettingsJson() NostalgiaCustomSettings {
	jsonPath, _ := a.NostalgiaSettingsJsonPath()
	var finalObject NostalgiaCustomSettings

	// Open file
	data, err := os.ReadFile(jsonPath)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return finalObject
	}

	json.Unmarshal(data, &finalObject)

	return finalObject
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

type IniObject = map[string]map[string]string

func (a *App) IniToObject() IniObject {
	selectedIniPath, _ := a.OptionIniPath()
	finalObject := make(IniObject)

	// Open file
	data, err := os.ReadFile(selectedIniPath)
	if err != nil {
		runtime.LogError(a.ctx, err.Error())
		return finalObject
	}

	fileData := string(data)

	splitFile := strings.Split(fileData, "\n")

	currentTopLevel := ""

	// Split file on new lines
	for _, line := range splitFile {
		if strings.HasPrefix(line, "[") {
			currentTopLevel = line[1 : len(line)-1]
			finalObject[currentTopLevel] = make(map[string]string)
			continue
		}

		if len(line) < 1 {
			currentTopLevel = ""
			continue
		}

		if currentTopLevel == "" {
			log.Fatal("option.ini is malformed, cant adjust settings")
			continue
		}

		splitLine := strings.Split(line, "=")
		key := splitLine[0]
		value := splitLine[1]

		finalObject[currentTopLevel][key] = value
	}

	return finalObject
}

func (a *App) ObjectToIniFile(obj IniObject) {
	path, _ := a.OptionIniPath()

	final := ""

	for topKey, params := range obj {
		final += fmt.Sprintf("[%s]\n", topKey)
		for key, value := range params {
			final += fmt.Sprintf("%s=%s\n", key, value)
		}
		final += "\n"
	}

	// Write to file
	f, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0755)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	f.WriteString(final)
}

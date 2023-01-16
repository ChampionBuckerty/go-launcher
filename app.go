package main

import (
	"changeme/internal"
	"context"
	"fmt"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx      context.Context
	CanPatch bool
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		CanPatch: false,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's GAME time V19!", name)
}

func (a *App) CloseApp() {
	runtime.Quit(a.ctx)
}

// domReady is called after the front-end dom has been loaded
func (a *App) domReady(ctx context.Context) {
	runtime.LogInfo(a.ctx, "Checking For Updates")
	a.UpdateCheckUI()
}

func (a *App) CanWePatch() bool {
	return a.CanPatch
}

func (a *App) UpdateCheckUI() {
	shouldUpdate, _ := internal.CheckForUpdate()
	if shouldUpdate {
		buttons := []string{"Ok"}
		dialogOpts := runtime.MessageDialogOptions{Title: "Update Required", Message: "New Launcher Version Available, You must update to continue", Type: runtime.InfoDialog, Buttons: buttons, DefaultButton: "Ok"}

		action, err := runtime.MessageDialog(a.ctx, dialogOpts)
		if err != nil {
			runtime.LogError(a.ctx, "Error in update dialog. ")
		}

		runtime.LogInfo(a.ctx, action)
		if action == "Ok" {
			runtime.LogInfo(a.ctx, "Update clicked")
			updated := internal.DoSelfUpdate()
			buttons = []string{"Ok"}

			if updated {
				dialogOpts = runtime.MessageDialogOptions{Title: "Update Succeeded", Message: "Update Successful. Please restart the launcher.", Type: runtime.InfoDialog, Buttons: buttons, DefaultButton: "Ok"}
			} else {
				dialogOpts = runtime.MessageDialogOptions{Title: "Update Error", Message: "Update failed, please report this on Nostalgia Discord.", Type: runtime.InfoDialog, Buttons: buttons, DefaultButton: "Ok"}
			}

			nextAction, nextErr := runtime.MessageDialog(a.ctx, dialogOpts)
			if nextAction == "Ok" || nextErr != nil {
				a.CloseApp()
			}
		}
	} else {
		a.CanPatch = true
	}
}

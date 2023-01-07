package main

import (
	"changeme/internal"
	"context"
	"fmt"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's GAME time V7!", name)
}

// domReady is called after the front-end dom has been loaded
func (a *App) domReady(ctx context.Context) {
	runtime.LogInfo(a.ctx, "Checking For Updates")
	a.UpdateCheckUI()
}

func (a *App) UpdateCheckUI() {
	shouldUpdate, _ := internal.CheckForUpdate()
	if shouldUpdate {
		updateMessage := "New Launcher Version Available, You must update to continue"
		buttons := []string{"Proceed"}
		dialogOpts := runtime.MessageDialogOptions{Title: "Update Available", Message: updateMessage, Type: runtime.QuestionDialog, Buttons: buttons, DefaultButton: "Proceed"}
		action, err := runtime.MessageDialog(a.ctx, dialogOpts)
		if err != nil {
			runtime.LogError(a.ctx, "Error in update dialog. ")
		}
		runtime.LogInfo(a.ctx, action)
		if action == "Yes" {
			runtime.LogInfo(a.ctx, "Update clicked")
			updated := internal.DoSelfUpdate()
			if updated {
				buttons = []string{"Ok"}
				dialogOpts = runtime.MessageDialogOptions{Title: "Update Succeeded", Message: "Update Successfull. Please restart this app to take effect.", Type: runtime.InfoDialog, Buttons: buttons, DefaultButton: "Ok"}
			} else {
				buttons = []string{"Ok"}
				dialogOpts = runtime.MessageDialogOptions{Title: "Update Error", Message: "Update failed, please report this on Nostalgia Discord.", Type: runtime.InfoDialog, Buttons: buttons, DefaultButton: "Ok"}
			}
			nextAction, nextErr := runtime.MessageDialog(a.ctx, dialogOpts)
			if nextAction == "Ok" || nextErr != nil {
				runtime.Quit(a.ctx)
			}
		}
	}
}

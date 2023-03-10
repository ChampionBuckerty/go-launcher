package internal

import (
	"log"

	"github.com/blang/semver"
	"github.com/rhysd/go-github-selfupdate/selfupdate"
)

const Version = "0.1.7"

func DoSelfUpdate() bool {
	v := semver.MustParse(Version)
	latest, err := selfupdate.UpdateSelf(v, "blurnos/nos-launcher")
	if err != nil {
		log.Println("Binary update failed:", err)
		return false
	}
	if latest.Version.Equals(v) {
		// latest version is the same as current version. It means current binary is up to date.
		log.Println("Current binary is the latest version", Version)
		return true
	} else {
		log.Println("Successfully updated to version", latest.Version)
		log.Println("Release note:\n", latest.ReleaseNotes)
		return true
	}
}

func CheckForUpdate() (bool, string) {
	latest, found, err := selfupdate.DetectLatest("blurnos/nos-launcher")
	if err != nil {
		log.Println("Error occurred while detecting version:", err)
		return false, ""
	}

	v := semver.MustParse(Version)
	if !found || latest.Version.LTE(v) {
		log.Println("Current version is the latest")
		return false, ""
	}

	return true, latest.Version.String()
}

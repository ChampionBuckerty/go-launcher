import axios from 'axios'
import * as React from 'react'
import { useState, useCallback, useEffect } from 'react'
import {
  FetchGameVersion,
  LaunchGame,
  DownloadAndInstallPatch,
} from '../../wailsjs/go/main/App'
import './Patch.css'
import ProgressBar from './ProgressBar'
import { EventsOn } from '../../wailsjs/runtime'

const Patch: React.FunctionComponent = () => {
  const [percentage, setPercentage] = useState<number>(0)
  const [availablePatches, setAvailablePatches] = useState<string[]>([])
  const [fullyPatched, setFullyPatched] = useState<boolean>(false)
  const [launching, setLaunching] = useState<boolean>(false)
  const [currentAction, setCurrentAction] = useState<string>('')
  const [lastPatchLength, setLastPatchLength] = useState<number>(0)
  const [totalPatchLength, setTotalPatchLength] = useState<number>(0)
  const [bypassClickCounter, setBypassClickCounter] = useState<number>(0)
  const [currentVersion, setCurrentVersion] = useState<number>(0)

  FetchGameVersion().then((version) => {
    setCurrentVersion(version)
  })

  const launchGame = useCallback(() => {
    if (launching) return

    if (fullyPatched) {
      setLaunching(true)
      LaunchGame()
    }
  }, [fullyPatched, setLaunching, launching])

  useEffect(() => {
    EventsOn('downloadProgress', async (singleFilePercent: number) => {
      const eachFileMaxPercent = 100.0 / totalPatchLength

      let currentFileNumber = totalPatchLength - lastPatchLength

      const basePercent = currentFileNumber * eachFileMaxPercent

      const progress = Math.round(
        basePercent + singleFilePercent * eachFileMaxPercent,
      )

      setPercentage(progress)
    })

    EventsOn('currentActionUpdates', async (actionMessage: string) => {
      setCurrentAction(actionMessage)
    })
  }, [])

  const downloadAndUnzipPatch = async () => {
    const localPatches = availablePatches
    let patchUrl = localPatches.shift()
    setAvailablePatches(localPatches)

    if (!patchUrl) {
      return
    }

    const splitPatchUrl = patchUrl.split('/')
    let fileName = splitPatchUrl[splitPatchUrl.length - 1]

    if (fileName === 'file') {
      // Lets remove that crap and fix the rest
      splitPatchUrl.pop()
      fileName = splitPatchUrl[splitPatchUrl.length - 1]
      patchUrl = splitPatchUrl.join('/')
    }

    const patchVersion = fileName.split('-')[1].split('.')[0]
    const patchNumber = patchVersion.substring(1)

    DownloadAndInstallPatch(patchUrl, parseInt(patchNumber))
  }

  // If we've got any available patches, download and install them
  useEffect(() => {
    if (
      availablePatches === null ||
      availablePatches?.length === 0 ||
      !totalPatchLength ||
      lastPatchLength === 0
    ) {
      return
    }

    if (availablePatches?.length == lastPatchLength) {
      downloadAndUnzipPatch()
    }
  }, [availablePatches, lastPatchLength, totalPatchLength])

  // Fetch all available patches based on users current version
  useEffect(() => {
    if (currentVersion === 0) return

    axios({
      url: `https://api.nos.tw/updates?version=${currentVersion}`,
    }).then((response) => {
      setAvailablePatches(response.data.patches)
      setLastPatchLength(response.data.patches.length)
      setTotalPatchLength(response.data.patches.length)
      if (response.data.patches.length < 1) {
        setPercentage(100)
        setFullyPatched(true)
        setCurrentAction('All patches already installed!')
      }
    })
  }, [currentVersion])

  return (
    <div className="Patch">
      <div
        className="ProgressContainer"
        onClick={() => {
          setBypassClickCounter((count) => count + 1)
          if (bypassClickCounter > 5) {
            setFullyPatched(true)
            setPercentage(100)
            setCurrentAction(
              "Patch bypass used! Make sure you don't miss any patches!",
            )
          }
        }}
      >
        <ProgressBar percentage={percentage} />
        <div className="ProgressActionText">{currentAction}</div>
      </div>
      <div className="LaunchContainer">
        <button
          onClick={launchGame}
          className={`Launch ${fullyPatched ? '' : 'disabled'}`}
        >
          Launch Game
        </button>
        <div>
          <button
            // onClick={() => ipcRenderer.invoke("settingsWindow:show")}
            className="Settings"
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default Patch

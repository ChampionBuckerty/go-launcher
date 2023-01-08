import axios from 'axios'
import * as React from 'react'
import { useState, useCallback, useEffect } from 'react'
import {
  FetchGameVersion,
  LaunchGame,
  InstallAllPatches,
} from '../../wailsjs/go/main/App'
import './Patch.css'
import ProgressBar from './ProgressBar'
import { EventsOn } from '../../wailsjs/runtime'

const Patch: React.FunctionComponent = () => {
  const [percentage, setPercentage] = useState<number>(0)
  const [fullyPatched, setFullyPatched] = useState<boolean>(false)
  const [launching, setLaunching] = useState<boolean>(false)
  const [currentAction, setCurrentAction] = useState<string>('')
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
    EventsOn('downloadProgress', async (progress: number) => {
      setPercentage(progress)
    })

    EventsOn('currentActionUpdates', async (actionMessage: string) => {
      if (percentage === 100) {
        return
      }

      setCurrentAction(actionMessage)
    })
  }, [])

  useEffect(() => {
    if (percentage === 100) {
      setFullyPatched(true)
      setCurrentAction('All patches installed!')
    }
  }, [percentage])

  // Fetch all available patches based on users current version
  useEffect(() => {
    if (currentVersion === 0) return

    axios({
      url: `https://api.nos.tw/updates?version=${currentVersion}`,
    }).then((response) => {
      if (response.data.patches.length < 1) {
        setPercentage(100)
        setFullyPatched(true)
        setCurrentAction('All patches already installed!')
        return
      }

      const patchNumbers = response.data.patches.map((p: string) => {
        const split = p.split('-')
        const patchVersion = split[split.length - 1].split('.')[0]
        return parseInt(patchVersion.substring(1))
      })

      InstallAllPatches(response.data.patches, patchNumbers)
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

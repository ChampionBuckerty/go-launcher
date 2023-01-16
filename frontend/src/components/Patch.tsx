import axios from 'axios'
import * as React from 'react'
import { useState, useCallback, useEffect } from 'react'
import {
  FetchGameVersion,
  LaunchGame,
  InstallAllPatches,
  CanWePatch,
} from '../../wailsjs/go/main/App'
import './Patch.css'
import ProgressBar from './ProgressBar'
import { EventsOn } from '../../wailsjs/runtime'
import { Pages } from '../App'

interface Props {
  setActivePage: (activePage: Pages) => void
}

const Patch: React.FunctionComponent<Props> = ({ setActivePage }) => {
  const [percentage, setPercentage] = useState<number>(0)
  const [fullyPatched, setFullyPatched] = useState<boolean>(false)
  const [launching, setLaunching] = useState<boolean>(false)
  const [currentAction, setCurrentAction] = useState<string>('')
  const [bypassClickCounter, setBypassClickCounter] = useState<number>(0)
  const [currentVersion, setCurrentVersion] = useState<number>(0)

  useEffect(() => {
    if (currentVersion !== 0) return

    FetchGameVersion().then((version) => {
      setCurrentVersion(version)
    })
  }, [currentVersion])

  const launchGame = useCallback(() => {
    if (launching) return

    if (fullyPatched) {
      setLaunching(true)
      LaunchGame()
    }
  }, [fullyPatched, setLaunching, launching])

  useEffect(() => {
    // @ts-ignore
    const actionListener = window.runtime.EventsOn(
      'currentActionUpdates',
      async (actionMessage: string) => {
        if (percentage === 100) {
          return
        }

        setCurrentAction(actionMessage)
      },
    )

    return () => {
      actionListener()
    }
  }, [percentage])

  useEffect(() => {
    // @ts-ignore
    const progressListener = window.runtime.EventsOn(
      'downloadProgress',
      async (progress: number) => {
        setPercentage(progress)
      },
    )

    return () => {
      progressListener()
    }
  }, [])

  useEffect(() => {
    if (percentage === 100 && !fullyPatched) {
      setFullyPatched(true)
      setCurrentAction('All patches have been installed!')
    }
  }, [percentage, fullyPatched])

  // Fetch all available patches based on users current version
  useEffect(() => {
    if (currentVersion === 0) return

    // Don't try to patch if theres a launcher update pending
    CanWePatch().then((res) => {
      if (!res) {
        return
      }
    })

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
            onClick={() => setActivePage(Pages.settings)}
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

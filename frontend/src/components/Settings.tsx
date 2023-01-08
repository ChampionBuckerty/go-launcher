import { Pages } from '../App'
import CustomSwitch from './Switch'
import CustomSelect, { OptionType } from './Select'
import { useCallback, useEffect, useMemo, useState } from 'react'
import './Settings.css'
import { IniToObject, ObjectToIniFile } from '../../wailsjs/go/main/App'

interface Props {
  setActivePage: (activePage: Pages) => void
}

export const Settings: React.FC<Props> = ({ setActivePage }) => {
  const [optionsHash, setOptionsHash] = useState<{
    [name: string]: { [name: string]: string }
  }>({})
  const [fullScreen, setFullScreen] = useState<boolean>(false)
  const [selectedResolution, setSelectedResolution] = useState<OptionType>({
    label: '1024x768',
    value: '0',
  })

  const resolutionOptions: OptionType[] = useMemo(() => {
    return [
      {
        label: '1024x768',
        value: '0',
      },
      {
        label: '1280x1024',
        value: '1',
      },
      {
        label: '1440x900',
        value: '2',
      },
      {
        label: '1600x900',
        value: '3',
      },
    ]
  }, [])

  useEffect(() => {
    if (Object.keys(optionsHash).length === 0) {
      const doWork = async () => {
        const newHash = await IniToObject()

        setOptionsHash(newHash)

        if (!newHash['MODE']) {
          console.log('COULDNT READ INI - no settings hash', newHash)
          return
        }

        const newFullScreen = newHash['MODE']['CLIENTMODE'] === '0'
        setFullScreen(newFullScreen)

        const resolutionValue = newHash['MODE']['RESOLUTION']
        const newResolutionOption = resolutionOptions.find((option) => {
          return option.value === resolutionValue
        })
        if (newResolutionOption) {
          setSelectedResolution(newResolutionOption)
        }
      }

      doWork()
    }
  }, [resolutionOptions])

  const saveOptions = useCallback(() => {
    const newHash = optionsHash

    if (!newHash['MODE']) {
      console.log('COULDNT UPDATE INI - no settings hash', newHash)
      return
    }
    const fullScreenNumber = fullScreen ? '0' : '1'
    newHash['MODE']['CLIENTMODE'] = fullScreenNumber

    const selectedResolutionString = selectedResolution.value as string
    newHash['MODE']['RESOLUTION'] = selectedResolutionString

    ObjectToIniFile(newHash)
    setActivePage(Pages.home)
  }, [optionsHash, fullScreen, selectedResolution])

  return (
    <div className="SettingsWindow">
      <div className="SettingsContent">
        <div className="SettingsHeader">
          <div className="SettingsHeaderText">Settings</div>
        </div>
        <div className="Options">
          <div className="Option">
            <div className="OptionLabel">Full Screen</div>
            <CustomSwitch
              checked={fullScreen}
              onChange={() => setFullScreen(!fullScreen)}
            />
          </div>
          <div className="Option">
            <div className="OptionLabel">Resolution</div>
            <CustomSelect
              options={resolutionOptions}
              value={selectedResolution?.value as string}
              onChange={setSelectedResolution}
            />
          </div>
        </div>

        <div className="SettingsControlButtons">
          <button
            className="BackButton"
            onClick={() => setActivePage(Pages.home)}
          >
            Back
          </button>
          <button className="SaveButton" onClick={saveOptions}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

import { Pages } from '../App'
import CustomSwitch from './Switch'
import CustomSelect, { OptionType } from './Select'
import { useCallback, useEffect, useMemo, useState } from 'react'
import './Settings.css'
import {
  IniToObject,
  ObjectToIniFile,
  ReadNostalgiaSettingsJson,
  SaveNostalgiaSettingsJson,
} from '../../wailsjs/go/main/App'

interface Props {
  setActivePage: (activePage: Pages) => void
}

interface NostalgiaCustomSettings {
  altToggle: boolean
  customRes: boolean
  width: number
  height: number
}

// Build a config hash - tag each field as custom or not

export const Settings: React.FC<Props> = ({ setActivePage }) => {
  const [loadedSettings, setLoadedSettings] = useState(false)
  const [optionsHash, setOptionsHash] = useState<{
    [name: string]: { [name: string]: string }
  }>({})
  const [fullScreen, setFullScreen] = useState<boolean>(false)
  const [selectedResolution, setSelectedResolution] = useState<OptionType>({
    label: '1024x768',
    value: '0',
  })
  const [customConfigHash, setCustomConfigHash] =
    useState<NostalgiaCustomSettings>({
      altToggle: true,
      customRes: false,
      width: 1024,
      height: 768,
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
      {
        label: '1920x1080',
        value: '1920x1080',
      },
    ]
  }, [])

  const wrappedUpdateResolution = useCallback(
    (newResolution: OptionType) => {
      const selectedResolutionString = newResolution.value as string

      if (selectedResolutionString.length != 1) {
        const [width, height] = selectedResolutionString.split('x')

        setCustomConfigHash((currentConfig) => {
          return {
            ...currentConfig,
            customRes: true,
            width: parseInt(width),
            height: parseInt(height),
          }
        })
      } else {
        setCustomConfigHash((currentConfig) => {
          return {
            ...currentConfig,
            customRes: false,
          }
        })
      }

      setSelectedResolution(newResolution)
    },
    [
      setSelectedResolution,
      setCustomConfigHash,
      customConfigHash,
      selectedResolution,
    ],
  )

  const loadCustomJson = async () => {
    const json = await ReadNostalgiaSettingsJson()

    setCustomConfigHash((currentConfig) => {
      return {
        ...currentConfig,
        altToggle: json.ALTTOGGLE,
        customRes: json.CUSTOMRES,
        width: json.WIDTH,
        height: json.HEIGHT,
      }
    })

    if (json.CUSTOMRES) {
      const newResolutionOption = resolutionOptions.find((option) => {
        return option.value === `${json.WIDTH}x${json.HEIGHT}`
      })

      if (newResolutionOption) {
        setSelectedResolution(newResolutionOption)
      }
    }
  }

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

        loadCustomJson()

        setLoadedSettings(true)
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
    if (selectedResolutionString.length === 1) {
      newHash['MODE']['RESOLUTION'] = selectedResolutionString
    } else {
      // We have a custom value - using override
      newHash['MODE']['RESOLUTION'] = '0'
    }

    ObjectToIniFile(newHash)
    // Save JSON too
    saveJson()

    setActivePage(Pages.home)
  }, [optionsHash, fullScreen, selectedResolution, customConfigHash])

  const saveJson = () => {
    SaveNostalgiaSettingsJson({
      ALTTOGGLE: customConfigHash.altToggle,
      CUSTOMRES: customConfigHash.customRes,
      WIDTH: customConfigHash.width,
      HEIGHT: customConfigHash.height,
    })
  }

  if (!loadedSettings) {
    return (
      <div className="SettingsWindow">
        <div className="SettingsContent">
          <div className="SettingsHeader">
            <div className="SettingsHeaderText">Settings</div>
          </div>
          <div className="Options">Loading...</div>
        </div>
      </div>
    )
  }

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
              onChange={(newResolution) =>
                wrappedUpdateResolution(newResolution)
              }
            />
          </div>
          <div className="Option">
            <div className="OptionLabel">Alt Toggle</div>
            <CustomSwitch
              checked={customConfigHash.altToggle}
              onChange={() => {
                setCustomConfigHash((currentConfig) => {
                  return {
                    ...currentConfig,
                    altToggle: !currentConfig.altToggle,
                  }
                })
              }}
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

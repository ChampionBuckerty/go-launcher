import * as React from 'react'
import Switch from 'react-switch'

type Props = {
  checked: boolean
  onChange: (boolean: boolean) => void
  disabled?: boolean
}

const CustomSwitch: React.FunctionComponent<Props> = ({
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <Switch
      disabled={disabled}
      checked={checked}
      onChange={onChange}
      onColor="#ff8000"
      offColor="#808080"
      onHandleColor="#ffffff"
      handleDiameter={14}
      activeBoxShadow="0 0 0 rgba(0,0,0,0)"
      boxShadow="0 0 0 rgba(0,0,0,0)"
      uncheckedIcon={false}
      checkedIcon={false}
      height={20}
      width={32}
    />
  )
}

export default CustomSwitch

import * as React from 'react'
import Select from 'react-select'
import { useCallback } from 'react'

import './Select.css'

const defaultSelectStyles = {
  control: (styles: any) => ({
    ...styles,
    border: '1px solid grey',
    borderRadius: '4px',
    borderColor: 'none',
    boxShadow: 'none',
    fontSize: '12px',
    backgroundColor: 'black',
    color: 'white',
  }),
  indicatorSeparator: (styles: any) => ({
    ...styles,
    backgroundColor: 'grey',
  }),
  menuList: (styles: any) => ({
    ...styles,
    fontSize: '12px',
    opacity: '1',
    backgroundColor: 'black',
    color: 'white',
    singleValue: (styles: any) => ({
      ...styles,
      backgroundColor: 'green',
    }),
  }),
  //currently selected
  singleValue: (styles: any) => ({
    ...styles,
    color: 'white',
  }),

  option: (
    styles: any,
    {
      isFocused,
      isSelected,
    }: {
      data: any
      isFocused: boolean
      isSelected: boolean
    },
  ) => {
    let backgroundColor = 'black'

    if (isSelected) backgroundColor = '#ffc500'
    if (isFocused) backgroundColor = '#ffc500'

    return {
      ...styles,
      backgroundColor,

      ':active': {
        ...styles[':active'],
        backgroundColor,
      },
    }
  },
}

export type OptionType = {
  value: string | number | boolean
  label: string
}

const SelectCustom = ({
  options,
  value,
  onChange,
  placeholder,
  isDisabled = false,
}: {
  options: OptionType[]
  value: string
  onChange: (arg: { value: string; label: string }) => void
  placeholder?: string
  isDisabled?: boolean
}): JSX.Element => {
  const defaultOnChange = useCallback(
    (e: any) => {
      if (onChange) {
        onChange(e)
      }
    },
    [onChange],
  )

  return (
    <div className="Settings__Select">
      {placeholder ? (
        <div className="Settings__Select-Placeholder">
          {value ? placeholder : ''}
        </div>
      ) : null}
      <Select
        // @ts-ignore
        styles={defaultSelectStyles}
        options={options}
        value={options.find((o) => o.value === value)}
        onChange={defaultOnChange}
        isDisabled={isDisabled}
      />
    </div>
  )
}

export default SelectCustom

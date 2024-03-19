import { FormControlLabel, Radio } from '@mui/material'
import React from 'react'

type Props = {
    state: string
    setState: React.Dispatch<React.SetStateAction<string>>
    value: string
    label: string
}
export default function RadioButton({state, setState, value, label}: Props) {
  const handelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(event.target.value)
  }
  return (
    <FormControlLabel 
        value={value}
        control={<Radio checked={state === value} onChange={handelChange} />}
        label={label}
    />
  )
}

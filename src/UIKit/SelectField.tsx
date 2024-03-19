import { CheckField } from '@/types/CheckField'
import { RadioField } from '@/types/RadioField'
import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React from 'react'

type Props = {
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
    valueList: CheckField[] | []
    radioList: RadioField[] | []
}
export const SelectFieldCheck = ({ value, setValue, valueList, radioList } : Props) => {
    const handleChange = (e: SelectChangeEvent) => {
        setValue(e.target.value);
    }
    if(valueList.length > 0) {
        return (
            <Select
                style={{width: "150px"}}
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={value}
                label="回答タイプ選択"
                onChange={handleChange}
            >
                {valueList.map((val) => (
                    <MenuItem value={val.title} key={val.id}>{val.title}</MenuItem>
                ))}
            </Select>
        )
    } else if(radioList.length > 0) {
        return(
            <Select
                style={{width: "150px"}}
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={value}
                label="回答タイプ選択"
                onChange={handleChange}
            >
                {radioList.map((val) => (
                    <MenuItem value={val.title} key={val.id}>{val.title}</MenuItem>
                ))}
            </Select>
        )
    }
}
import { QuestionType } from '@/types/Question'
import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React from 'react'

type Props = {
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
    valueList: QuestionType[]
}
export const SelectQuestion = ({ value, setValue, valueList } : Props) => {
    const handleChange = (e: SelectChangeEvent) => {
        setValue(e.target.value);
    }
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
                <MenuItem value={val.id} key={val.id}>{val.title}</MenuItem>
            ))}
        </Select>
    )
}
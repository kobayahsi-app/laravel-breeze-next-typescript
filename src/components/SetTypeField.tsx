import { Add, Delete, Edit } from '@mui/icons-material'
import { Checkbox, IconButton, Radio, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

type Props = {
    type: number
    types: {index: number, title: string}[]
    setTypes: React.Dispatch<React.SetStateAction<{index: number, title: string}[]>>
}
export default function SetTypeField({ type, types, setTypes }: Props) {
    const [index, setIndex] = useState<number>(0);
    const [title, setTitle] = useState<string>('');

    const inputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }

    const addSheet = (index: number, title: string) => {
        if(title === "") {
            return alert('項目を入力してください。')
        }
        if(index === types.length) {
            setTypes(prevState => [...prevState, {index: index, title: title}])
            setIndex(index + 1);
            setTitle("");
        } else {
            const newTypes = types;
            setTypes(newTypes);
            setIndex(newTypes.length);
            setTitle("");
        }
    }

    const editSheet = (index: number, title: string) => {
        setIndex(index);
        setTitle(title);
    }

    const deleteSheet = (deleteIndex: number) => {
        const newTypeList = types.filter((item, i) => i !== deleteIndex);
        setTypes(newTypeList)
    }

    useEffect(() => {
        setIndex(types.length)
    }, [types.length])

    return (
        <div className='my-5'>
            {types.length > 0 && (
                types.map((item, i) => (
                    <div key={i} className='flex justify-between items-center'>
                        <div className='flex justify-start items-center'>
                            {type === 0 ? <Radio /> : <Checkbox />}
                            <p>{item.title}</p>
                        </div>
                        <div className='flex justify-start items-center'>
                            <IconButton onClick={() => editSheet(i, item.title)}>
                                <Edit />
                            </IconButton>
                            <IconButton onClick={() => deleteSheet(i)}>
                                <Delete />
                            </IconButton>
                        </div>
                    </div>
                ))
            )}
            <div className='flex justify-between items-center my-5'>
                <div className='flex justify-start items-center'>
                    {type === 0 ? <Radio /> : <Checkbox />}
                    <TextField 
                        style={{width: '100%'}}
                        id="standard-basic" 
                        label="" 
                        variant="standard" 
                        value={title} 
                        onChange={inputTitle} 
                    />
                </div>
                <IconButton onClick={() => addSheet(index, title)}>
                    <Add />
                </IconButton>
            </div>
        </div>
    )
}

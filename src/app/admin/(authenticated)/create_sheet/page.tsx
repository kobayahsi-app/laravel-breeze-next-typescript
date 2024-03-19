'use client'
import RadioButton from '@/components/RadioButton';
import { useAuth } from '@/hooks/auth';
import laravelAxios from '@/lib/laravelAxios';
import { Add } from '@mui/icons-material';
import { Button, FormControlLabel, RadioGroup, Switch } from '@mui/material';
import React, { useState } from 'react'

export default function CreateSheet() {
    const { user } = useAuth({middleware: 'auth'})
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [themeColor, setThemeColor] = useState<string>('');
    const [publicState, setPublicState] = useState<boolean>(false);
    const [slug, setSlug] = useState<string>('');

    const inputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }
    const inputDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    }
    const inputSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlug(e.target.value);
    }

    const changePublic = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPublicState(event.target.checked);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimedTitle = title.trim();
        const trimedDiscription = description.trim();
        const trimedSlug = slug.trim();
        if(!trimedTitle || !trimedDiscription || !trimedSlug) {
            return;
        }
        try {
            const response = await laravelAxios.post('api/sheets', {
                title: trimedTitle,
                description: trimedDiscription,
                theme_color: themeColor,
                public: publicState,
                slug: trimedSlug,
                user_id: user?.id
            })
        } catch(error) {
            console.log(error);
        }
    }
    return (
        <div className='py-12'>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className='flex justify-between'>
                    <h2>問診票</h2>
                    <FormControlLabel control={<Switch checked={publicState} onChange={changePublic}  />} label={publicState == false ? "非公開" : "公開"} />
                </div>
                <div className='form my-10'>
                    <form action="POST" onSubmit={handleSubmit}>
                        <div className='form_item'>
                            <label htmlFor="title">問診票名</label>
                            <input value={title} onChange={inputTitle} type="text" name='title' id='title' />
                        </div>
                        <div className='form_item my-5'>
                            <label htmlFor="description">問診票概要</label>
                            <textarea value={description} onChange={inputDescription} name='description' id='description' rows={5}></textarea>
                        </div>
                        <div className='form_item my-5'>
                            <label htmlFor="slug">スラッグ</label>
                            <input value={slug} onChange={inputSlug} type="text" name='slug' id='title' />
                        </div>
                        <div className='form_item my-5'>
                            <label htmlFor="slug">カラー</label>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                                <RadioButton state={themeColor} setState={setThemeColor} value='red' label='レッド' />
                                <RadioButton state={themeColor} setState={setThemeColor} value='blue' label='ブルー' />
                                <RadioButton state={themeColor} setState={setThemeColor} value='green' label='グリーン' />
                                <RadioButton state={themeColor} setState={setThemeColor} value='gray' label='グレー' />
                                <RadioButton state={themeColor} setState={setThemeColor} value='white' label='ホワイト' />
                                <RadioButton state={themeColor} setState={setThemeColor} value='black' label='ブラック' />
                            </RadioGroup>
                        </div>
                        <Button 
                            variant='contained' 
                            type='submit'
                            style={{
                                backgroundColor: '#1976d2',
                                color: '#fff',
                            }}
                        >新規作成</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

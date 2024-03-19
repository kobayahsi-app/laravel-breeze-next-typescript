'use client'
import RadioButton from '@/components/RadioButton';
import laravelAxios from '@/lib/laravelAxios';
import { SheetType } from '@/types/Sheet';
import { Button, FormControlLabel, RadioGroup, Switch } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function EditSheet({ params }: { params: { sheetId: string }}) {
    const sheetId = params.sheetId;
    const [sheet, setSheet] = useState<SheetType | null>(null);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [themeColor, setThemeColor] = useState<string>('');
    const [publicState, setPublicState] = useState<boolean>(false);
    const [slug, setSlug] = useState<string>('');
    const router = useRouter();

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

    useEffect(() => {
        if(!sheetId) {
            return;
        }
        const fetchSheet = async() => {
            try {
                const response = await laravelAxios.get(`api/sheet/${sheetId}`);
                setTitle(response.data.title);
                setDescription(response.data.description);
                setThemeColor(response.data.theme_color);
                setPublicState(response.data.public);
                setSlug(response.data.slug);
            } catch(error) {
                console.log(error);
            }
        }
        fetchSheet();
    }, [sheetId]);

    const updateSheet = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimedTitle = title.trim();
        const trimedDiscription = description.trim();
        const trimedSlug = slug.trim();
        if(!trimedTitle || !trimedDiscription || !trimedSlug) {
            return;
        }
        try {
            const response = await laravelAxios.put(`api/sheet/${sheetId}`, {
                title: trimedTitle,
                description: trimedDiscription,
                theme_color: themeColor,
                public: publicState,
                slug: trimedSlug,
            })
            router.push('/admin/sheets')
        } catch(error) {
            console.log(error);
        }
    }

    const handleDelete = async() => {
        if(window.confirm('質問を削除してもいいですか？')) {
          try {
            const response = await laravelAxios.delete(`api/sheet/${sheetId}`);
            router.push('/admin/sheets')
          } catch(error) {
            console.log(error)
          }
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
                    <form action="POST" onSubmit={updateSheet}>
                        <div className='form_item my-5'>
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
                        >編集</Button>
                        <Button onClick={() => handleDelete()}>削除</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

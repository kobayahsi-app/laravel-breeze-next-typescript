'use client'
import { SelectMenu } from '@/UIKit/SelectMenu'
import laravelAxios from '@/lib/laravelAxios'
import { QuestionType } from '@/types/Question'
import switchSelectField from '@/utils/SwitchSelectField'
import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const typeList = [
  {id: 0, name: "ラジオ"},
  {id: 1, name: "チェックボックス"},
  {id: 2, name: "数字"},
  {id: 3, name: "テキスト"},
  {id: 4, name: "テキストエリア"},
  {id: 5, name: "日付"},
  {id: 6, name: "住所"},
  {id: 7, name: "ファイル"},
]

type TypeProps = {
  index: number
  title: string
}

export default function EditQuestion({ params }: { params: { questionId: string } }) {
  const questionId = params.questionId;
  const router = useRouter();
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [types, setTypes] = useState<TypeProps[]>([]);
  const [title, setTitle] = useState<string>('');
  const [placeholder, setPlaceholder] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [required, setRequired] = useState<boolean>(false);

  const inputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }
  const inputPlaceholder = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaceholder(e.target.value);
  }
  const changeRequired = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequired(e.target.checked)
  }

  useEffect(() => {
    if(!questionId) {
      return;
    }

    const fetchQuestion = async() => {
      try {
        const response = await laravelAxios.get(`api/question/${questionId}`);
        const data = response.data;
        setQuestion(data);
        setTitle(data.title);
        setType(data.type);
        setPlaceholder(data.placeholder);
        setRequired(data.required === 0 ? false : true);
        setTypes(data.fields);
      } catch(error) {
        console.log(questionId);
        console.log(error);
      }
    }

    fetchQuestion();
  }, [questionId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimedTitle = title.trim();
    if(!trimedTitle) {
      window.alert('質問内容を必ず入れてください。')
      return;
    }
    try {
      const response = await laravelAxios.put(`api/question/${questionId}`, {
        title: trimedTitle,
        type: Number(type),
        required: required,
      });
      question?.fields.map(async (field) => {
        const fieldId = field.id;
        await laravelAxios.delete(`api/field/${fieldId}`);
      })
      let typeResponse;
      if(Number(type) === 0) {
        // ラジオタイプ
        await Promise.all(types.map(async (doc, index) => {
          typeResponse = await laravelAxios.post('api/fields', {
            question_id: questionId,
            value: doc.title,
            title: doc.title,
            checked: false,
            field_index: index
          });
        }));
      } else if(Number(type) === 1) {
        // チェックボックス
        await Promise.all(types.map(async (doc, index) => {
          typeResponse = await laravelAxios.post('api/fields', {
            question_id: questionId,
            checked: false,
            title: doc.title,
            field_index: index
          });
        }));
      } else if(Number(type) === 2) {
        // 数字
        typeResponse = await laravelAxios.post('api/fields', {
          question_id: questionId,
          num: 0,
          checked: false,
          field_index: 0
        });
      } else if(Number(type) === 3) {
        // テキストフィールド
        typeResponse = await laravelAxios.post('api/fields', {
          question_id: questionId,
          value: placeholder,
          placeholder: placeholder,
          checked: false,
          field_index: 0
        });
      } else if(Number(type) === 4) {
        // テキストエリア
        typeResponse = await laravelAxios.post('api/fields', {
          question_id: questionId,
          value: placeholder,
          placeholder: placeholder,
          checked: false,
          field_index: 0
        });
      } else if(Number(type) === 5) {
        // 日付
        typeResponse = await laravelAxios.post('api/fields', {
          question_id: questionId,
          checked: false,
          field_index: 0
        });
      } else if(Number(type) === 6) {
        typeResponse = await laravelAxios.post('api/fields', {
          question_id: questionId,
          value: "郵便番号",
          placeholder: "郵便番号（ハイフンなし）",
          checked: false,
          field_index: 0
        });
      } else if(Number(type) === 7) {
        typeResponse = await laravelAxios.post('api/fields', {
          question_id: questionId,
          checked: false,
          field_index: 0
        });
      }
    } catch(error) {
      console.log(error)
    } finally {
      router.push(`/admin/create_questions/${question!.section.id}`);
    }
  }

  return (
    <div className='py-12'>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <section className='py-5'>
          <Box component="form" onSubmit={handleSubmit}>
            <h2>質問</h2>
            <div className='my-3 flex justify-between'>
              <TextField 
                value={title} 
                onChange={inputTitle} 
                style={{width: "80%"}} 
                type="text" 
                placeholder='質問を記入してください'  
              />
              <FormControlLabel 
                control={
                  <Checkbox 
                    checked={required}
                    onChange={changeRequired}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label="必須項目"
              />
            </div>
            <SelectMenu value={type} setValue={setType} valueList={typeList} />
            {switchSelectField(type, types, setTypes, placeholder)}
            {Number(type) === 3 || Number(type) === 4 ? (
              <TextField 
                value={placeholder} 
                onChange={inputPlaceholder} 
                className='my-3' 
                style={{width: "80%"}} 
                type="text" 
                variant="standard"
                id="standard-basic"
                placeholder='ヒントテキスト'  
              />
            ) : (
              <div style={{display: "none"}}></div>
            )}
            <button type='submit' style={{backgroundColor: "#CCC", fontWeight: "bold"}} className='mb-5 py-3 px-7'>質問編集</button>
          </Box>
        </section>
      </div>
    </div>
  )
}

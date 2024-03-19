'use client';
import { SelectFieldCheck } from '@/UIKit/SelectField';
import { SelectMenu } from '@/UIKit/SelectMenu';
import { SelectQuestion } from '@/UIKit/SelectQuestion';
import laravelAxios from '@/lib/laravelAxios';
import { CheckField } from '@/types/CheckField';
import { QuestionType } from '@/types/Question';
import { RadioField } from '@/types/RadioField';
import { SubQuestionType } from '@/types/SubQuestion';
import switchSelectField from '@/utils/SwitchSelectField';
import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
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

export default function EditSubQuestion({ params } : { params: { subQuestionId: string } }) {
    const subQuestionId = params.subQuestionId;
    const router = useRouter();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [subQuestion, setSubQuestion] = useState<SubQuestionType | null>(null);
    const [types, setTypes] = useState<TypeProps[]>([]);
    const [title, setTitle] = useState<string>('');
    const [placeholder, setPlaceholder] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [required, setRequired] = useState<boolean>(false);

    const [questionId, setQuestionId] = useState<string>('');
    const [connectAnswer, setConnectAnswer] = useState<string>('');

    const [radioFields, setRadioFields] = useState<RadioField[]>([]);
    const [checkFields, setCheckFields] = useState<CheckField[]>([]);

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
        if(!subQuestionId) {
          return;
        }
    
        const fetchQuestion = async() => {
          try {
            const response = await laravelAxios.get(`api/subQuestion/${subQuestionId}`);
            const data = response.data;
            setSubQuestion(data);
            setQuestionId(data.question.id)
            setTitle(data.title);
            setType(data.type);
            setConnectAnswer(data.terms);
            setPlaceholder(data.fields[0].placeholder);
            setRequired(data.required === 0 ? false : true);
            setTypes(data.fields);
          } catch(error) {
            console.log(error);
          }
        }
    
        fetchQuestion();
    }, [subQuestionId]);

    useEffect(() => {
        if(subQuestion === null) return;

        const fetchQuestions = async() => {
            try {
                const response = await laravelAxios.get(`api/questions/${subQuestion.section_id}`);
                setQuestions(response.data);
            } catch(error) {
                console.log(subQuestion.section_id);
                console.log(error);
            }
        }

        fetchQuestions();
    }, [subQuestion]);

    useEffect(() => {
        const fetchField = async() => {
            try {
                const newQuestion = questions.filter((doc) => doc.id === Number(questionId))[0];
                if(newQuestion !== undefined) {
                  if(newQuestion.type === 0) {
                    const response = await laravelAxios.get(`api/fields/${questionId}`);
                    setRadioFields(response.data);
                  } else if(newQuestion.type === 1) {
                    const response = await laravelAxios.get(`api/fields/${questionId}`);
                    setCheckFields(response.data);
                  }
                }
              } catch(error) {
                console.log(error);
            }
        }
        fetchField();
    }, [questionId, questions])

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimedTitle = title.trim();
        if(!trimedTitle) {
          window.alert('質問内容を必ず入れてください。')
          return;
        }
        try {
            const response = await laravelAxios.put(`api/subQuestion/${subQuestionId}`, {
              title: trimedTitle,
              type: Number(type),
              terms: connectAnswer,
              question_id: Number(questionId),
              required: required,
            });
            subQuestion?.fields.map(async (field) => {
                const fieldId = field.id;
                await laravelAxios.delete(`api/field/${fieldId}`);
            })
            if(Number(type) === 0) {
              // ラジオタイプ
              await Promise.all(types.map(async (doc, index) => {
                await laravelAxios.post('api/fields', {
                  sub_question_id: subQuestionId,
                  value: doc.title,
                  title: doc.title,
                  checked: false,
                  field_index: index
                });
              }));
            } else if(Number(type) === 1) {
              // チェックボックス
              await Promise.all(types.map(async (doc, index) => {
                await laravelAxios.post('api/fields', {
                  sub_question_id: subQuestionId,
                  checked: false,
                  title: doc.title,
                  field_index: index
                });
              }));
            } else if(Number(type) === 2) {
              // 数字
              await laravelAxios.post('api/fields', {
                sub_question_id: subQuestionId,
                num: 0,
                checked: false,
                field_index: 0
              });
            } else if(Number(type) === 3) {
              // テキストフィールド
              await laravelAxios.post('api/fields', {
                sub_question_id: subQuestionId,
                value: placeholder,
                placeholder: placeholder,
                checked: false,
                field_index: 0
              });
            } else if(Number(type) === 4) {
              // テキストエリア
              await laravelAxios.post('api/fields', {
                sub_question_id: subQuestionId,
                value: placeholder,
                placeholder: placeholder,
                checked: false,
                field_index: 0
              });
            } else if(Number(type) === 5) {
              // 日付
              await laravelAxios.post('api/fields', {
                sub_question_id: subQuestionId,
                checked: false,
                field_index: 0
              });
            } else if(Number(type) === 6) {
              await laravelAxios.post('api/fields', {
                sub_question_id: subQuestionId,
                value: "郵便番号",
                placeholder: "郵便番号（ハイフンなし）",
                checked: false,
                field_index: 0
              });
            } else if(Number(type) === 7) {
              await laravelAxios.post('api/fields', {
                sub_question_id: subQuestionId,
                checked: false,
                field_index: 0
              });
            }
          } catch(error) {
            console.log(error);
          } finally {
            router.push(`/admin/create_questions/${subQuestion!.section_id}`);
          }
    }
    return (
        <div className='py-12'>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <section style={{backgroundColor: "#EEE"}} className='py-12 px-6'>
                    <Box component="form" onSubmit={handleSubmit}>
                    <h2>サブ質問</h2>
                    <div className='flex justify-between'>
                        <p>表示条件</p>
                        <div className='flex justify-start'>
                        <SelectQuestion value={questionId} setValue={setQuestionId} valueList={questions} />
                        {questionId !== "" && <SelectFieldCheck value={connectAnswer} setValue={setConnectAnswer} valueList={checkFields} radioList={radioFields} />}
                        </div>
                    </div>
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
                    <button style={{backgroundColor: "#CCC", fontWeight: "bold"}} className='py-3 px-10 mt-4'>サブ質問追加</button>
                    </Box>
                </section>
            </div>
        </div>
    )
}

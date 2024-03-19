'use client'
import { SelectFieldCheck } from '@/UIKit/SelectField';
import { SelectQuestion } from '@/UIKit/SelectQuestion';
import { SelectSection } from '@/UIKit/SelectSection';
import laravelAxios from '@/lib/laravelAxios';
import { CheckField } from '@/types/CheckField';
import { QuestionType } from '@/types/Question';
import { RadioField } from '@/types/RadioField';
import { SectionType } from '@/types/Section';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function EditSection({ params }: { params: {sheetId: string, sectionId: string} }) {
    const router = useRouter();
    const sheetId = params.sheetId;
    const sectionId = params.sectionId;
    const [section, setSection] = useState<SectionType | null>(null);
    const [sections, setSections] = useState<SectionType[]>([]);
    const [selectId, setSelectId] = useState<string>('');
    const [questionId, setQuesitonId] = useState<string>('');
    const [connectAnswer, setConnectAnswer] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [radioFields, setRadioFields] = useState<RadioField[]>([]);
    const [checkFields, setCheckFields] = useState<CheckField[]>([]);
    const inputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    }
    const inputDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    }

    useEffect(() => {
        if(!sheetId) {
            return;
        }
        const fetchSection = async() => {
            try {
                const [sectionResponse, sectionsResponse] = await Promise.all([
                    laravelAxios.get(`api/section/${sectionId}`),
                    laravelAxios.get(`api/sections/${sheetId}`),
                ]);
                if(sectionResponse.data.connect_question !== 0) {
                  const response = await laravelAxios.get(`api/question/${sectionResponse.data.connect_question}`)
                  setSelectId(response.data.section.id)
                }
                setSection(sectionResponse.data);
                setTitle(sectionResponse.data.title);
                setDescription(sectionResponse.data.description);
                setQuesitonId(sectionResponse.data.connect_question);
                setConnectAnswer(sectionResponse.data.connect_answer);
                setSections(sectionsResponse.data);
            } catch(error) {
                console.log(error)
            }
        }
        fetchSection();
    }, [sheetId]);

    useEffect(() => {
        if(!selectId) {
          return;
        }
        const fetchQuestion = async() => {
          try {
            const response = await laravelAxios.get(`api/questions/${selectId}`);
            setQuestions(response.data);
          } catch(error) {
            console.log(error);
          }
        }
        fetchQuestion();
      }, [selectId])
    
    useEffect(() => {
        if(!questionId) {
          return;
        }
        const fetchField = async() => {
          try {
            const newQuestion: QuestionType = questions.filter((doc) => doc.id === Number(questionId))[0];
            if(newQuestion !== undefined) {
              const response = await laravelAxios.get(`api/fields/${questionId}`);
              if(newQuestion.type === 0) {
                setRadioFields(response.data);
              } else if(newQuestion.type === 1) {
                setCheckFields(response.data);
              }
            }
          } catch(error) {
            console.log(error);
          }
        }
        fetchField();
      }, [questions])

    const updateSection = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimedTitle = title.trim();
        const trimedDescription = description.trim();
        try {
          const response = await laravelAxios.put(`api/section/${sectionId}`, {
            title: trimedTitle,
            description: trimedDescription,
            connect_question: questionId,
            connect_answer: connectAnswer
          });
          router.push(`/admin/create_section/${sheetId}`);
          console.log(connectAnswer)
        } catch(error) {
          console.log(error);
        }
    } 
    return(
        <div className='py-12'>
            <section className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <h2>{section?.sheet?.title}</h2>
                <div className='flex justify-between mt-5'>
                    <p>表示条件</p>
                    <div className='flex justify-start'>
                        {sections.length > 0 && <SelectSection value={selectId} setValue={setSelectId} valueList={sections} />}
                        {selectId !== "" && <SelectQuestion value={questionId} setValue={setQuesitonId} valueList={questions} />}
                        {questionId !== "" && <SelectFieldCheck value={connectAnswer} setValue={setConnectAnswer} valueList={checkFields} radioList={radioFields} />}
                    </div>
                </div>
                <div className='form my-10'>
                    <form action="POST" onSubmit={updateSection}>
                        <div className='form_item'>
                            <label htmlFor="title">セクションタイトル</label>
                            <input value={title} onChange={inputTitle} type="text" name='title' id='title' />
                        </div>
                        <div className='form_item my-5'>
                            <label htmlFor="description">セクション説明</label>
                            <textarea value={description} onChange={inputDescription} name='description' id='description' rows={5}></textarea>
                        </div>
                        <Button 
                            variant='contained' 
                            type='submit'
                            style={{
                                backgroundColor: '#1976d2',
                                color: '#fff',
                            }}
                        >編集</Button>
                    </form>
                </div>
            </section>
        </div>
    )
}

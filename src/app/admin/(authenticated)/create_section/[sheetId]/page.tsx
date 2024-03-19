'use client'
import { SelectFieldCheck } from '@/UIKit/SelectField';
import { SelectQuestion } from '@/UIKit/SelectQuestion';
import { SelectSection } from '@/UIKit/SelectSection';
import laravelAxios from '@/lib/laravelAxios';
import { CheckField } from '@/types/CheckField';
import { QuestionType } from '@/types/Question';
import { RadioField } from '@/types/RadioField';
import { SectionType } from '@/types/Section';
import { SheetType } from '@/types/Sheet';
import { Add, Delete, Edit } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function  CreateSection({ params }: { params: { sheetId: string }}) {
  const sheetId = params.sheetId;
  const router = useRouter();
  const [sheet, setSheet] = useState<SheetType | null>(null);
  const [sections, setSections] = useState<SectionType[]>([]);
  const [sectionId, setSectionId] = useState<string>('');
  const [questionId, setQuesitonId] = useState<string>('');
  const [connectAnswer, setConnectAnswer] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [radioFields, setRadioFields] = useState<RadioField[]>([]);
  const [checkFields, setCheckFields] = useState<CheckField[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);


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
    const fetchSheet = async() => {
      try {
        const [sheetResponse, sectionResponse] = await Promise.all([
          laravelAxios.get(`api/sheet/${sheetId}`),
          laravelAxios.get(`api/sections/${sheetId}`),
        ])
        setSheet(sheetResponse.data);
        setSections(sectionResponse.data);
      } catch(error) {
        console.log(error);
      }
    }
    fetchSheet();
  }, [sheetId]);

  useEffect(() => {
    if(!sectionId) {
      return;
    }
    const fetchQuestion = async() => {
      try {
        const response = await laravelAxios.get(`api/questions/${sectionId}`);
        console.log(sectionId);
        console.log(response.data);
        setQuestions(response.data);
      } catch(error) {
        console.log(error);
      }
    }
    fetchQuestion();
  }, [sectionId])

  useEffect(() => {
    if(!questionId) {
      return;
    }
    const fetchField = async() => {
      try {
        const newQuestion = questions.filter((doc) => doc.id === Number(questionId))[0];
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
  }, [questionId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimedTitle = title.trim();
    const trimedDescription = description.trim();
    if(!trimedTitle || !trimedDescription) {
      window.alert('タイトルと説明は必ず入れてください。')
      return;
    }
    try {
      const response = await laravelAxios.post('api/sections', {
          title: trimedTitle,
          description: trimedDescription,
          sheet_id: sheetId,
          connect_question: Number(questionId),
          connect_answer: connectAnswer,
          index: sections.length
      })

      const newSection = response.data;
      setSections([...sections, newSection]);
      setQuestions([]);
      setCheckFields([]);
      setRadioFields([]);
      setTitle("");
      setDescription("");
    } catch(error) {
        console.log(error);
    }
  }

  const dragStart = (index: number) => {
    setDragIndex(index);
  }

  const dragEnter = (index: number) => {
    if(index === dragIndex) return;

    setSections((prevState) => {
      let newSections = JSON.parse(JSON.stringify(prevState));
      const deleteElement = newSections.splice(dragIndex, 1)[0];
      newSections.splice(index, 0, deleteElement);

      return newSections;
    });

    setDragIndex(index);
  }

  const updateIndex = async(index: number, sectionId: number) => {
    try {
      const response = await laravelAxios.put(`api/sectionIndex/${sectionId}`, {
        index: index
      });
    } catch(error) {
      console.log(error);
    }
  }

  const dragEnd = () => {
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if(section.index === i) continue;

      updateIndex(i, section.id);
    }
    setDragIndex(null);
  };

  const handleDelete = async(sectionId: number) => {
    if(window.confirm('質問を削除してもいいですか？')) {
      try {
        const response = await laravelAxios.delete(`api/section/${sectionId}`);
        const filterdSection = sections.filter((section: SectionType) => section.id !== sectionId);
        setSections(filterdSection);
      } catch(error) {
        console.log(error)
      }
    }
  }
  return (
    <div className='py-12'>
        <section className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className='flex justify-between'>
            <h2>{sheet?.title}</h2>
            <p>{sheet?.public ? "公開" : "非公開"}</p>
          </div>
        </section>
        <section className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className='flex justify-between mt-5'>
            <p>表示条件</p>
            <div className='flex justify-start'>
              {sections.length > 0 && <SelectSection value={sectionId} setValue={setSectionId} valueList={sections} />}
              {sectionId !== "" && <SelectQuestion value={questionId} setValue={setQuesitonId} valueList={questions} />}
              {questionId !== "" && <SelectFieldCheck value={connectAnswer} setValue={setConnectAnswer} valueList={checkFields} radioList={radioFields} />}
            </div>
          </div>
          <div className='form my-10'>
            <form action="POST" onSubmit={handleSubmit}>
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
                >新規作成</Button>
            </form>
          </div>
        </section>
        <section className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <table>
            <thead>
              <tr>
                <th>タイトル</th>
                <th>メモ</th>
                <th>編集</th>
                <th>質問作成</th>
                <th>削除</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section, index) => (
                <tr 
                  key={section.id} 
                  draggable={true} 
                  onDragStart={() => dragStart(index)} 
                  onDragEnter={() => dragEnter(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDragEnd={() => dragEnd()}
                  className={index === dragIndex ? 'dragging active' : 'dragging'}
                >
                  <td>{section.title}</td>
                  <td>{section.description}</td>
                  <td>
                    <IconButton onClick={() => router.push(`/admin/edit_section/${sheetId}/${section.id}`)}>
                      <Edit />
                    </IconButton>
                  </td>
                  <td>
                    <IconButton onClick={() => router.push(`/admin/create_questions/${section.id}`)}>
                      <Add />
                    </IconButton>
                  </td>
                  <td>
                    <IconButton onClick={() => handleDelete(section.id)}>
                      <Delete />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
    </div>
  )
}

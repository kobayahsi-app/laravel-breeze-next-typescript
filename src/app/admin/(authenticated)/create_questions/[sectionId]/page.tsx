'use client'
import { SelectFieldCheck } from '@/UIKit/SelectField';
import { SelectMenu } from '@/UIKit/SelectMenu';
import { SelectQuestion } from '@/UIKit/SelectQuestion';
import laravelAxios from '@/lib/laravelAxios';
import { CheckField } from '@/types/CheckField';
import { QuestionType } from '@/types/Question';
import { RadioField } from '@/types/RadioField';
import { SectionType } from '@/types/Section';
import switchFieldType from '@/utils/SwitchFieldType';
import switchSelectField from '@/utils/SwitchSelectField';
import switchSubFieldType from '@/utils/SwitchSubFieldType';
import { Delete, Edit } from '@mui/icons-material';
import { Box, Checkbox, FormControlLabel, IconButton, TextField } from '@mui/material';
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
export default function CreateQuestions({ params }: { params: { sectionId: string } }) {
    const router = useRouter();
    const sectionId = params.sectionId;
    const [section, setSection] = useState<SectionType | null>(null);
    const [types, setTypes] = useState<TypeProps[]>([])
    const [subTypes, setSubTypes] = useState<TypeProps[]>([])
    const [title, setTitle] = useState<string>('');
    const [placeholder, setPlaceholder] = useState<string>('');
    const [required, setRequired] = useState<boolean>(false);
    const [type, setType] = useState<string>('');
    const [subTitle, setSubtitle] = useState<string>('');
    const [subPlaceholder, setSubPlaceholder] = useState<string>('');
    const [subRequired, setSubRequired] = useState<boolean>(false);
    const [subType, setSubType] = useState<string>('');

    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [questionId, setQuestionId] = useState<string>('');

    const [radioFields, setRadioFields] = useState<RadioField[]>([]);
    const [checkFields, setCheckFields] = useState<CheckField[]>([]);

    const [connectAnswer, setConnectAnswer] = useState<string>('');

    const [dragQuestion, setDragQuestion] = useState<number | null>(null);
    const [dragSubQs, setDragSubQs] = useState<number | null>(null);
    const [dragFields, setDragFields] = useState<number | null>(null);

    const inputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    }
    const inputSubTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSubtitle(e.target.value);
    }
    const inputPlaceholder = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPlaceholder(e.target.value);
    }
    const inputSubPlaceholder = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSubPlaceholder(e.target.value);
    }
    const changeRequired = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRequired(e.target.checked)
    }
    const changeSubRequired = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSubRequired(e.target.checked)
    }

    useEffect(() => {
      if(!sectionId) {
        return;
      }
      const fetchSection = async() => {
        try {
          const response = await laravelAxios.get(`api/section/${sectionId}`);
          setSection(response.data);
          setQuestions(response.data.questions);
        } catch(error) {
          console.log(error)
        }
      }
      fetchSection();
    }, []);

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
    }, [questionId]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const trimedTitle = title.trim();
      if(!trimedTitle) {
        window.alert('質問内容を必ず入れてください。')
        return;
      }
      try {
        const response = await laravelAxios.post('api/questions', {
          title: trimedTitle,
          section_id: sectionId,
          type: Number(type),
          question_index: questions.length,
          required: required,
        });

        const newQuestion = response.data;

        let typeResponse;
        if(Number(type) === 0) {
          // ラジオタイプ
          await Promise.all(types.map(async (doc, index) => {
            typeResponse = await laravelAxios.post('api/fields', {
              question_id: newQuestion.id,
              value: doc.title,
              title: doc.title,
              checked: false,
              field_index: index,
            });
          }));
        } else if(Number(type) === 1) {
          // チェックボックス
          await Promise.all(types.map(async (doc, index) => {
            typeResponse = await laravelAxios.post('api/fields', {
              question_id: newQuestion.id,
              checked: false,
              title: doc.title,
              field_index: index
            });
          }));
        } else if(Number(type) === 2) {
          // 数字
          typeResponse = await laravelAxios.post('api/fields', {
            question_id: newQuestion.id,
            num: 0,
            checked: false,
            field_index: 0
          });
        } else if(Number(type) === 3) {
          // テキストフィールド
          typeResponse = await laravelAxios.post('api/fields', {
            question_id: newQuestion.id,
            value: placeholder,
            placeholder: placeholder,
            checked: false,
            field_index: 0
          });
        } else if(Number(type) === 4) {
          // テキストエリア
          typeResponse = await laravelAxios.post('api/fields', {
            question_id: newQuestion.id,
            value: placeholder,
            placeholder: placeholder,
            checked: false,
            field_index: 0
          });
        } else if(Number(type) === 5) {
          // 日付
          typeResponse = await laravelAxios.post('api/fields', {
            question_id: newQuestion.id,
            checked: false,
            field_index: 0
          });
        } else if(Number(type) === 6) {
          typeResponse = await laravelAxios.post('api/fields', {
            question_id: newQuestion.id,
            value: "郵便番号",
            placeholder: "郵便番号（ハイフンなし）",
            checked: false,
            field_index: 0
          });
        } else if(Number(type) === 7) {
          typeResponse = await laravelAxios.post('api/fields', {
            question_id: newQuestion.id,
            checked: false,
            field_index: 0
          });
        } 

        const updateQuestion = {
          ...newQuestion,
          fields: [typeResponse!.data],
          sub_questions: []
        }
        
        setQuestions([...questions, updateQuestion,]);
      } catch(error) {
        console.log(error)
      } finally {
        setTitle("");
        setType("");
        setRequired(false);
      }
    }
    
    const addSubquestion = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const targetQuestion = questions.filter((question) => question.id === Number(questionId))[0];

      const trimedTitle = subTitle.trim();
      if(!trimedTitle) {
        window.alert('質問内容を必ず入れてください。')
        return;
      }
      try {
        const response = await laravelAxios.post('api/subQuestions', {
          title: trimedTitle,
          section_id: sectionId,
          type: Number(subType),
          question_index: targetQuestion.sub_questions.length,
          terms: connectAnswer,
          required: subRequired,
          question_id: Number(questionId)
        });

        const newQuestion = response.data;
        let typeResponse;
        if(Number(subType) === 0) {
          // ラジオタイプ
          await Promise.all(subTypes.map(async (doc, index) => {
            typeResponse = await laravelAxios.post('api/fields', {
              sub_question_id: newQuestion.id,
              value: doc.title,
              title: doc.title,
              checked: false,
              field_index: index
            });
          }));
        } else if(Number(subType) === 1) {
          // チェックボックス
          await Promise.all(subTypes.map(async (doc, index) => {
            typeResponse = await laravelAxios.post('api/fields', {
              sub_question_id: newQuestion.id,
              checked: false,
              title: doc.title,
              field_index: index,
            });
          }));
        } else if(Number(subType) === 2) {
          // 数字
          typeResponse = await laravelAxios.post('api/fields', {
            sub_question_id: newQuestion.id,
            num: 0,
            checked: false,
            field_index: 0
          });
        } else if(Number(subType) === 3) {
          // テキストフィールド
          typeResponse = await laravelAxios.post('api/fields', {
            sub_question_id: newQuestion.id,
            value: subPlaceholder,
            placeholder: subPlaceholder,
            checked: false,
            field_index: 0
          });
        } else if(Number(subType) === 4) {
          // テキストエリア
          typeResponse = await laravelAxios.post('api/fields', {
            sub_question_id: newQuestion.id,
            value: subPlaceholder,
            placeholder: subPlaceholder,
            checked: false,
            field_index: 0
          });
        } else if(Number(subType) === 5) {
          // 日付
          typeResponse = await laravelAxios.post('api/fields', {
            sub_question_id: newQuestion.id,
            checked: false,
            field_index: 0
          });
        } else if(Number(subType) === 6) {
          typeResponse = await laravelAxios.post('api/fields', {
            sub_question_id: newQuestion.id,
            value: "郵便番号",
            placeholder: "郵便番号（ハイフンなし）",
            checked: false,
            field_index: 0
          });
        } else if(Number(subType) === 7) {
          typeResponse = await laravelAxios.post('api/fields', {
            sub_question_id: newQuestion.id,
            checked: false,
            field_index: 0
          });
        }

        const updateSubQuestion = {
          ...newQuestion,
          fields: [typeResponse?.data]
        }

        const updatedQuestions = questions.map((question) => {
          if(question.id === Number(questionId)){
            return {
              ...question,
              sub_questions: [...question.sub_questions, updateSubQuestion],
              fields: question.fields
            }
          }
          return question;
        });
        setQuestions(updatedQuestions);
      } catch(error) {
        console.log(error)
        window.alert('エラー')
      } finally {
        setSubType("");
        setSubtitle("");
        setSubRequired(false);
        setRadioFields([]);
        setCheckFields([]);
      }
    }


    // questionドラッグ関数
    const dragStartQs = (index: number) => {
        setDragQuestion(index);
    }
    
    const dragEnterQs = (index: number) => {
        if(index === dragQuestion) return;
      
        setQuestions((prevState) => {
            let newQuestions = JSON.parse(JSON.stringify(prevState));
            const deleteElement = newQuestions.splice(dragQuestion, 1)[0];
            newQuestions.splice(index, 0, deleteElement);
      
            return newQuestions;
        });
      
        setDragQuestion(index);
    }

    const updateIndex = async(index: number, questionid: number) => {
      try {
        await laravelAxios.put(`api/questionIndex/${questionid}`, {
          question_index: index
        });
      } catch(error) {
        console.log(error);
      }
    }
  
    const dragEnd = () => {
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        if(question.question_index === i) continue;
  
        updateIndex(i, question.id);
      }
      setDragQuestion(null);
    };

    // sub_questionドラッグ関数
    const dragStartSubQs = (index: number) => {
      setDragSubQs(index);
    }

    const dragEnterSubQs = (qsIndex: number, subQsIndex: number) => {
      if(subQsIndex === dragSubQs) return;
      setQuestions((prevState) => {
        // questions配列をコピー
        let newQuestions = JSON.parse(JSON.stringify(prevState));
        // questionの指定
        const targetQuestion = newQuestions[qsIndex];
        // 指定したsub_questionsを展開
        let subQuestion = [...targetQuestion.sub_questions];
        const removed = subQuestion.splice(dragSubQs!, 1)[0];
        subQuestion.splice(subQsIndex, 0, removed);
        targetQuestion.sub_questions = subQuestion;
        return newQuestions;
      });

      setDragSubQs(subQsIndex);
    }

    const updateSubIndex = async(subQsIndex: number, subQuestionId: number) => {
      try {
        await laravelAxios.put(`api/subQuestionIndex/${subQuestionId}`, {
          question_index: subQsIndex
        });
      } catch(error) {
        console.log(error);
      }
    }

    const dragEndSubQs = (qsIndex: number) => {
      const targetQuestion = questions[qsIndex];
      for (let i = 0; i < targetQuestion.sub_questions.length; i++) {
        const subQuestion = targetQuestion.sub_questions[i];
        if(subQuestion.question_index === i) continue;
        updateSubIndex(i, subQuestion.id);
      }
      setDragSubQs(null);
    };


    const deleteQuestion = async(questionId: number) => {
      if(window.confirm('質問を削除してもいいですか？')) {
        try {
          const response = await laravelAxios.delete(`api/question/${questionId}`);
          const filterdQuestion = questions.filter((question: QuestionType) => question.id !== questionId);
          setQuestions(filterdQuestion);
        } catch(error) {
          console.log(error)
        }
      }
    }
    const deleteSubQuestion = async(subQuestionId: number) => {
      if(window.confirm('質問を削除してもいいですか？')) {
        try {
          const response = await laravelAxios.delete(`api/subQuestion/${subQuestionId}`);
          const filteredQuestions = questions.map((question) => ({
            ...question,
            sub_questions: question.sub_questions.filter((sub_question) => sub_question.id !== subQuestionId)
          }));

          setQuestions(filteredQuestions)
          
        } catch(error) {
          console.log(error)
        }
      }
    }

    return (
      <div className='py-12'>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <h2>質問作成<br />{section?.title}</h2>
              <section className='py-5'>
                <table>
                  <thead>
                    <tr>
                      <th>質問内容</th>
                      <th>フィールド</th>
                      <th>必須項目</th>
                      <th>編集</th>
                      <th>削除</th>
                    </tr>
                  </thead>
                  {questions.length > 0 && (
                    questions.map((qs, qs_index) => (
                      <tbody key={qs.id}>
                        <tr
                          draggable={true} 
                          onDragStart={() => dragStartQs(qs_index)} 
                          onDragEnter={() => dragEnterQs(qs_index)}
                          onDragOver={(event) => event.preventDefault()}
                          onDragEnd={() => dragEnd()}
                        >
                          <td>{qs.title}</td>
                          <td>
                            {switchFieldType(qs.type, qs.fields, dragFields, setDragFields, questions, setQuestions, qs_index)}
                          </td>
                          <td>
                            {qs.required === 0  ? "任意" : "必須"}
                          </td>
                          <td>
                            <IconButton onClick={() => router.push(`/admin/edit_question/${qs.id}`)}>
                              <Edit />
                            </IconButton>
                          </td>
                          <td>
                            <IconButton onClick={() => deleteQuestion(qs.id)}>
                              <Delete />
                            </IconButton>
                          </td>
                        </tr>
                        {qs.sub_questions.length > 0 && (
                            qs.sub_questions.map((sub_qs, sub_index) => (
                            <tr 
                              draggable={true}
                              onDragStart={() => dragStartSubQs(sub_index)} 
                              onDragEnter={() => dragEnterSubQs(qs_index, sub_index)}
                              onDragOver={(event) => event.preventDefault()}
                              onDragEnd={() => dragEndSubQs(qs_index)}
                              key={sub_qs.id}>
                              <td className='sub'>
                                {sub_qs.title}<br />
                                <span style={{fontSize: 12}}>※{qs.title}の答えが「{sub_qs.terms}」の時に表示</span>
                              </td>
                              <td className='sub'>
                                {switchSubFieldType(sub_qs.type, sub_qs.fields, dragFields, setDragFields, questions, setQuestions, qs_index, sub_index)}
                              </td>
                              <td className='sub'>
                                {sub_qs.required === 0 ? "任意" : "必須"}
                              </td>
                              <td className='sub'>
                                <IconButton onClick={() => router.push(`/admin/edit_sub_question/${sub_qs.id}`)}>
                                  <Edit />
                                </IconButton>
                              </td>
                              <td className='sub'>
                                <IconButton onClick={() => deleteSubQuestion(sub_qs.id)}>
                                  <Delete />
                                </IconButton>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    ))
                  )}
                </table>
              </section>
              <section className='py-5'>
                <Box component="form" onSubmit={handleSubmit}>
                  <button type='submit' style={{backgroundColor: "#CCC", fontWeight: "bold"}} className='mb-5 py-3 px-7'>質問追加</button>
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
                </Box>
              </section>
              <section style={{backgroundColor: "#EEE"}} className='py-12 px-6'>
                <Box component="form" onSubmit={addSubquestion}>
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
                      value={subTitle} 
                      onChange={inputSubTitle} 
                      className='my-3' 
                      style={{width: "80%"}} 
                      type="text" 
                      placeholder='質問を記入してください'  
                    />
                    <FormControlLabel 
                      control={
                        <Checkbox 
                          checked={subRequired}
                          onChange={changeSubRequired}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      }
                      label="必須項目"
                    />
                  </div>
                  <SelectMenu value={subType} setValue={setSubType} valueList={typeList} />
                  {switchSelectField(subType, subTypes, setSubTypes, subPlaceholder)}
                  {Number(subType) === 3 || Number(subType) === 4 ? (
                    <TextField 
                      value={subPlaceholder} 
                      onChange={inputSubPlaceholder} 
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

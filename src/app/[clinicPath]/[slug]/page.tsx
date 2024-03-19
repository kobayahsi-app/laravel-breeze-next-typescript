'use client'
import QuestionField from '@/feature/QuestionField';
import SubQuestionField from '@/feature/SubQuestionField';
import laravelAxios from '@/lib/laravelAxios';
import { QuestionType } from '@/types/Question';
import { SectionType } from '@/types/Section';
import { SheetType } from '@/types/Sheet';
import { Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import  QRcode  from "qrcode";

export default function Sheet({ params }: { params: { clinicPath: string, slug: string } }) {
    const clinicPath = params.clinicPath;
    const slug = params.slug;
    const [sheet, setSheet] = useState<SheetType | null>(null);
    const [sections, setSections] = useState<SectionType[]>([]);
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        if(!clinicPath) return;
        const fetchMedical = async() => {
          try {
            const response = await laravelAxios.get(`api/user/${clinicPath}`);
            const filterdSheet = response.data.sheets.filter((doc: SheetType) => doc.slug === slug)[0];
            setSheet(filterdSheet);
          } catch(error) {
            console.log(error)
          }
        }
    
        fetchMedical();
    }, []);

    useEffect(() => {
        if(!sheet?.id) {
            return;
        };

        const fetchSections = async() => {
            try {
                const response = await laravelAxios.get(`api/sections/${sheet.id}`);
                setSections(response.data);
            } catch(error) {
                console.log(error);
            }
        }
        fetchSections();
    }, [sheet?.id]);

    useEffect(() => {
        if(sections.length < 1) return;
        const allQuestions = sections.flatMap(section => section.questions);
        setQuestions(allQuestions);
    }, [sections])

    const convert2base64 = (file: Blob) => {
        const render = new FileReader();

        render.readAsDataURL(file)
    }
    
    const submitForm = async (formData: any) => {
        try {
            const newData: { [key: string]: { question: string, answer: string | string[]  } } = {};
            const questionData: { [key: string]: string | string[] } = {};
            const imageData: { [key: string]: Blob } = {};
            const subQuestionData : { [key: string]: string | string[] } = {};
            const fileNames = [];
            for(const key in formData) {
                // 1. 質問データとサブ質問データに分ける
                if(!key.includes("sub")) {
                    questionData[key] = formData[key];
                } else {
                    subQuestionData[key] = formData[key];
                }
                // 2. 各idをkeyから取得して、質問タイトルを取得する
                for(const questionKey in questionData) {
                    const match = questionKey.match(/\d+$/);
                    if(match) {
                        // keyからquestionIdのみ抽出
                        const questionId = match[0]
                        const filterdQuestion = questions.filter((question) => question.id === Number(questionId))[0];
                        if(filterdQuestion.type !== 7) {
                            if(Array.isArray(questionData[questionKey]) && questionData[questionKey].length > 0) {
                                newData[questionKey] = {
                                    question: filterdQuestion.title,
                                    answer: questionData[questionKey]
                                }
                            } else if(typeof questionData[questionKey] === 'string' && questionData[questionKey] !== "" && questionData[questionKey] !== null) {
                                newData[questionKey] = { 
                                    question: filterdQuestion.title,
                                    answer: filterdQuestion.type === 6 ? 
                                        `〒${questionData[questionKey]}\n${questionData[questionKey + "-pref"]}\n${questionData[questionKey + "-city"]}\n${questionData[questionKey + "-town"]}` 
                                        : questionData[questionKey] 
                                }
                            }
                        } 
                        else if(filterdQuestion.type === 7) {
                            const file: Blob | any = questionData[questionKey][0];
                            // const fileReader = new FileReader();
                            // fileReader.readAsDataURL(file as unknown as Blob);
                            imageData[questionKey] = file
                            fileNames.push(file);
                        }
                    }
                }
                // 2. 各idをkeyから取得して、質問タイトルを取得する
                for(const subQuestionKey in subQuestionData) {
                    const keyParts = subQuestionKey.split('-');
                    // keyからquestionIdのみ抽出
                    const questionId = keyParts[2];
                    // keyからsubQuestionIdのみ抽出
                    const subQuestionId = keyParts[3].split('-')[0];
                    const filterdQuestion = questions.filter((question) => question.id === Number(questionId))[0];
                    const filterdSubQuestion = filterdQuestion.sub_questions.filter((sub_question) => sub_question.id === Number(subQuestionId))[0];
                    if(keyParts.length >= 4) {
                        if(Array.isArray(subQuestionData[subQuestionKey]) && subQuestionData[subQuestionKey].length > 0) {
                            newData[subQuestionKey] = {
                                question: filterdSubQuestion.title,
                                answer: subQuestionData[subQuestionKey]
                            }
                        } else if(typeof subQuestionData[subQuestionKey] === 'string' && subQuestionData[subQuestionKey] !== "" && subQuestionData[subQuestionKey] !== null) {
                            newData[subQuestionKey] = { 
                                question: filterdSubQuestion.title,
                                answer: subQuestionData[subQuestionKey] 
                            }
                        }
                    }
                }
            }
            let message = "";
            let qrText = "";
            for(const key in newData) {
                const { question, answer } = newData[key];
                qrText += `${question}\n${answer}\n\n`;
                message += `<p style="font-weight: bold">${question}</p>\n<p>${answer}</p>\n\n`;
            }
            const qrCodeDataURL = await QRcode.toDataURL(qrText);
            message += `<img src=${qrCodeDataURL} />\n`;
            message += `<h2 style="display: none;">${qrCodeDataURL}</h2>`;
            message.trim();
            try {
                if(!newData) return;
                const formData = new FormData();
                let data = {
                    email: "yudai.kobayashi@empowertec.co.jp",
                    message: message,
                }
                formData.append("message", data.message);
                formData.append("email", data.email);
                for (const key in imageData) {
                    if (imageData.hasOwnProperty(key)) {
                        formData.append("fileName", imageData[key]);
                    }
                }
                await axios.post('/api/contact', formData)
                window.alert('送信成功')
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.error(error);
        } 
    };

    return (
        <div className='medical_sheet-root'>
            <h2>{sheet?.title}</h2>
            <Box component={"form"} onSubmit={handleSubmit(submitForm)}>
                {sections.length > 0 && (
                    sections.map((section, index) => {
                        const filterdQuestion = questions.filter((question) => question.id === section.connect_question)[0];
                        if(section.connect_answer !== null && questions.length > 0) {
                            if(filterdQuestion.type !== 1 && section.connect_answer === watch(`${filterdQuestion.section.index}-${filterdQuestion.question_index}-${filterdQuestion.id}`)) {
                                return(
                                    <section key={section.id} className='question_sheet'>
                                        <dl>
                                            <dt className='ttl'>{section.title}</dt>
                                        </dl>
                                        <div className=''>
                                            {section.questions.map((question) => (
                                                <div key={question.id}>
                                                    <dl>
                                                        <dt>{question.title}</dt>
                                                        <dd>
                                                            {QuestionField(question, register, setValue, errors, control)}
                                                        </dd>
                                                    </dl>
                                                    {question.sub_questions.map((sub_question) => {
                                                        if(watch(`${question.section.index}-${question.question_index}}-${question.id}`) === sub_question.terms && question.type === 0) {
                                                            return(
                                                                <dl key={sub_question.id}>
                                                                    <dt>{sub_question.title}</dt>
                                                                    <dd>
                                                                        {SubQuestionField(question, sub_question, register, setValue, errors, control)}
                                                                    </dd>
                                                                </dl>
                                                            )
                                                        } else if(question.type === 1 && watch(`${question.section.index}-${question.question_index}-${question.id}`, []).includes(sub_question.terms)) {
                                                            return(
                                                                <dl key={sub_question.id}>
                                                                    <dt>{sub_question.title}</dt>
                                                                    <dd>
                                                                        {SubQuestionField(question, sub_question, register, setValue, errors, control)}
                                                                    </dd>
                                                                </dl>
                                                            )
                                                        }
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )
                            } else if(filterdQuestion.type === 1  && watch(`${filterdQuestion.section.index}-${filterdQuestion.question_index}-${filterdQuestion.id}`) !== false && watch(`${filterdQuestion.section.index}-${filterdQuestion.question_index}-${filterdQuestion.id}`, []).includes(section.connect_answer)) {
                                return(
                                    <section key={section.id} className='question_sheet'>
                                        <dl>
                                            <dt className='ttl'>{section.title}</dt>
                                        </dl>
                                        <div className=''>
                                            {section.questions.map((question) => (
                                                <div key={question.id}>
                                                    <dl>
                                                        <dt>{question.title}</dt>
                                                        <dd>
                                                            {QuestionField(question, register, setValue, errors, control)}
                                                        </dd>
                                                    </dl>
                                                    {question.sub_questions.map((sub_question) => {
                                                        if(question.type !== 1 && watch(`${question.section.index}-${question.question_index}-${question.id}`) === sub_question.terms) {
                                                            return(
                                                                <dl key={sub_question.id}>
                                                                    <dt>{sub_question.title}</dt>
                                                                    <dd>
                                                                        {SubQuestionField(question, sub_question, register, setValue, errors, control)}
                                                                    </dd>
                                                                </dl>
                                                            ) 
                                                        } else if(question.type === 1 && watch(`${question.section.id}-${question.question_index}-${question.id}`, []).includes(sub_question.terms)) {
                                                            return(
                                                                <dl key={sub_question.id}>
                                                                    <dt>{sub_question.title}</dt>
                                                                    <dd>
                                                                        {SubQuestionField(question, sub_question, register, setValue, errors, control)}
                                                                    </dd>
                                                                </dl>
                                                            )
                                                        }
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )
                            }
                        } else {
                            return(
                                <section key={section.id} className='question_sheet'>
                                    <dl>
                                        <dt className='ttl'>{section.title}</dt>
                                    </dl>
                                    <div className=''>
                                        {section.questions.map((question) => (
                                            <div key={question.id}>
                                                <dl>
                                                    <dt>{question.title}</dt>
                                                    <dd>
                                                        {QuestionField(question, register, setValue, errors, control)}
                                                    </dd>
                                                </dl>
                                                {question.sub_questions.map((sub_question) => {
                                                    if(watch(`${question.section.index}-${question.question_index}-${question.id}`) === sub_question.terms && question.type !== 1) {
                                                        return(
                                                            <dl key={sub_question.id}>
                                                                <dt>{sub_question.title}</dt>
                                                                <dd>
                                                                    {SubQuestionField(question, sub_question, register, setValue, errors, control)}
                                                                </dd>
                                                            </dl>
                                                        )
                                                    } else if(question.type === 1 && watch(`${question.section.index}-${question.question_index}-${question.id}`, []).includes(sub_question.terms)) {
                                                        return(
                                                            <dl key={sub_question.id}>
                                                                <dt>{sub_question.title}</dt>
                                                                <dd>
                                                                    {SubQuestionField(question, sub_question, register, setValue, errors, control)}
                                                                </dd>
                                                            </dl>
                                                        )
                                                    }
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )
                        }
                    })
                )}
                <button type='submit'>送信</button>
            </Box>
        </div>
    )
}



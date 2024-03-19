import { QuestionType } from "@/types/Question";
import { SubQuestionType } from "@/types/SubQuestion";
import { Checkbox, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Control, Controller, FieldErrors, FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form";

export default function SubQuestionField(
    question: QuestionType,
    subQuestion: SubQuestionType, 
    register: UseFormRegister<FieldValues>, 
    setValue: UseFormSetValue<FieldValues>,
    errors: FieldErrors<FieldValues>,
    control: Control<FieldValues, any>,
) {
    const namedId = `${question.section.index}-${question.question_index}-${question.id}-${subQuestion.id}-sub`;
    if(subQuestion.type === 0) {
        return (
            <RadioGroup>
                <div>
                    {subQuestion.fields.map((field) => (
                        <FormControlLabel 
                            key={field.id}
                            value={field.value} 
                            label={field.title} 
                            id={namedId}
                            {...register(namedId, { required: subQuestion.required === 1 ? true : false })}
                            control={
                                <Radio />
                            } 
                        />
                    ))}
                </div>
                {errors.nameId && <div>必須項目が未入力です</div>}
            </RadioGroup>
        )
    } else if(subQuestion.type === 1) {
        return(
            <Controller
                control={control}
                name={`${subQuestion.id}`}
                defaultValue={[]}
                render={({ field }) => (
                    <div>
                        <div>
                            {subQuestion.fields.map((doc) => (
                                <FormControlLabel 
                                    key={doc.id}
                                    label={doc.title} 
                                    {...field}
                                    id={namedId}
                                    {...register(namedId, { required: subQuestion.required === 1 ? true : false })}
                                    control={
                                        <Checkbox value={doc.title} />
                                    } 
                                />
                            ))}
                        </div>
                        {errors.nameId && <div>必須項目が未入力です</div>}
                    </div>
                )}
            />
        )
    } else if(subQuestion.type === 2) {
        return (
            <div>
                {subQuestion.fields.map((field) => (
                    <div key={field.id}>
                        <input 
                            className="w-full" 
                            type="number" 
                            id={namedId}
                            {...register(namedId, { required: subQuestion.required === 1 ? true : false })}
                        />
                    </div>
                ))}
                {errors.nameId && <div>必須項目が未入力です</div>}
            </div>
        )
    } else if(subQuestion.type === 3) {
        return (
            <div>
                {subQuestion.fields.map((field) => (
                    <div key={field.id}>
                        <input 
                            type="text" 
                            className="w-full"
                            placeholder={field.placeholder} 
                            {...register(namedId, { required: subQuestion.required === 1 ? true : false })}
                            id={namedId}
                        />
                    </div>
                ))}
                {errors.nameId && <div>必須項目が未入力です</div>}
            </div>
        )
    } else if(subQuestion.type === 4) {
        return (
            <div>
                {subQuestion.fields.map((field) => (
                    <div key={field.id}>
                        <textarea 
                            rows={4} 
                            placeholder={field.placeholder} 
                            {...register(namedId, { required: subQuestion.required === 1 ? true : false })}
                            id={namedId}
                        ></textarea>
                    </div>
                ))}
                {errors.nameId && <div>必須項目が未入力です</div>}
            </div>
        )
    } else if(subQuestion.type === 5) {
        return (
            <div>
                {subQuestion.fields.map((field) => (
                    <div key={field.id}>
                        <input 
                            type="date" 
                            {...register(namedId, { required: subQuestion.required === 1 ? true : false })}
                            id={namedId}
                        />
                    </div>
                ))}
                {errors.nameId && <div>必須項目が未入力です</div>}
            </div>
        )
    } else if(subQuestion.type === 6) {
        return (
            <div>
                {subQuestion.fields.map((field) => (
                    <div key={field.id} className="mt-4">
                        <input 
                            type="text" 
                            className="w-full"
                            placeholder={field.placeholder} 
                            {...register(namedId, { required: subQuestion.required === 1 ? true : false })}
                            id={namedId}
                        />
                    </div>
                ))}
                {errors.nameId && <div>必須項目が未入力です</div>}
            </div>
        )
    }　else if(question.type === 6) {
        const handleZipCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const zipCode = e.target.value;
            setValue(namedId, zipCode);
        
            if (zipCode.length === 7) {
              try {
                const response = await fetch("https://api.zipaddress.net/?zipcode=" + zipCode);
                const responseData = await response.json();
                setValue(`${question.section.index}-${question.question_index}-${question.id}-pref`, responseData.data.pref)
                setValue(`${question.section.index}-${question.question_index}-${question.id}-city`, responseData.data.city)
                setValue(`${question.section.index}-${question.question_index}-${question.id}-town`, responseData.data.town)
              } catch (error) {
                console.error('Error fetching address:', error);
              }
            }
        };
        return (
            <div>
                {question.fields.map((field) => (
                    <div key={field.id}>
                        <input 
                            type="text" 
                            placeholder={field.placeholder} 
                            {...register(namedId, { 
                                required: question.required === 0 ? false : true ,
                                onChange: handleZipCodeChange
                            })}
                            id={namedId}
                        />
                        {errors[namedId] && <div style={{color: "red"}}>必須項目が未入力です</div>}
                        <div className="mt-4">
                            <input 
                                type="text" 
                                placeholder="都道府県" 
                                {...register(`${question.section.index}-${question.question_index}-${question.id}-${subQuestion.id}-pref`, { 
                                    required: false,
                                })}
                            />
                        </div>
                        <div className="mt-4">
                            <input 
                                type="text" 
                                placeholder="市区町村" 
                                {...register(`${question.section.index}-${question.question_index}-${question.id}-${subQuestion.id}-city`, { 
                                    required: false,
                                })}
                            />
                        </div>
                        <div className="mt-4">
                            <input 
                                type="text" 
                                placeholder="番地" 
                                {...register(`${question.section.index}-${question.question_index}-${question.id}-${subQuestion.id}-town`, { 
                                    required: false,
                                })}
                            />
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}
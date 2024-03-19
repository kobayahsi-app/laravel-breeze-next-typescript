import { QuestionType } from "@/types/Question";
import { Checkbox, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Control, Controller, FieldErrors, FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form";

export default function QuestionField(
    question: QuestionType, 
    register: UseFormRegister<FieldValues>, 
    setValue: UseFormSetValue<FieldValues>,
    errors: FieldErrors<FieldValues>,
    control: Control<FieldValues, any>,
) {
    const nameId = `${question.section.index}-${question.question_index}-${question.id}`;
    if(question.type === 0) {
        return (
            <RadioGroup>
                <div className="">
                    {question.fields.map((field) => (
                        <FormControlLabel 
                            key={field.id}
                            value={field.value} 
                            label={field.title} 
                            id={nameId}
                            {...register(nameId, { required: question.required === 0 ? false : true })}
                            control={
                                <Radio />
                            } 
                        />
                    ))}
                </div>
                {errors[nameId] && <div style={{color: "red"}}>必須項目が未入力です</div>}
            </RadioGroup>
        )
    } else if(question.type === 1) {
        return(
            <Controller
                control={control}
                name={`${question.id}`}
                defaultValue={[]}
                render={({ field }) => (
                    <div>
                        <div className="">
                            {question.fields.map((doc) => (
                                <FormControlLabel 
                                    key={doc.id}
                                    label={doc.title} 
                                    {...field}
                                    id={nameId}
                                    {...register(nameId, { required: question.required === 0 ? false : true })}
                                    control={
                                        <Checkbox value={doc.title} />
                                    } 
                                />
                            ))}
                        </div>
                        {errors[nameId] && <div style={{color: "red"}}>必須項目が未入力です</div>}
                    </div>
                )}
            />
        )
    } else if(question.type === 2) {
        return (
            <div>
                {question.fields.map((field) => (
                    <div key={field.id}>
                        <input 
                            type="number" 
                            {...register(nameId, { required: question.required === 0 ? false : true })}
                            id={nameId}
                        />
                    </div>
                ))}
                {errors[nameId] && <div style={{color: "red"}}>必須項目が未入力です</div>}
            </div>
        )
    } else if(question.type === 3) {
        return (
            <div>
                {question.fields.map((field) => (
                    <div key={field.id}>
                        <input 
                            type="text" 
                            placeholder={field.placeholder} 
                            {...register(nameId, { required: question.required === 0 ? false : true })}
                            id={nameId}
                        />
                    </div>
                ))}
                {errors[nameId] && <div style={{color: "red"}}>必須項目が未入力です</div>}
            </div>
        )
    } else if(question.type === 4) {
        return (
            <div>
                {question.fields.map((field) => (
                    <div key={field.id}>
                        <textarea 
                            rows={4} 
                            placeholder={field.placeholder} 
                            {...register(nameId, { required: question.required === 0 ? false : true })}
                            id={nameId}
                        ></textarea>
                    </div>
                ))}
                {errors[nameId] && <div style={{color: "red"}}>必須項目が未入力です</div>}
            </div>
        )
    } else if(question.type === 5) {
        return (
            <div>
                {question.fields.map((field) => (
                    <div key={field.id}>
                        <input 
                            type="date" 
                            {...register(nameId, { required: question.required === 0 ? false : true })}
                            id={nameId}
                        />
                    </div>
                ))}
                {errors[nameId] && <div style={{color: "red"}}>必須項目が未入力です</div>}
            </div>
        )
    } else if(question.type === 6) {
        const handleZipCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const zipCode = e.target.value;
            setValue(nameId, zipCode);
        
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
                            {...register(nameId, { 
                                required: question.required === 0 ? false : true ,
                                onChange: handleZipCodeChange
                            })}
                            id={nameId}
                        />
                        <div className="mt-4">
                            <input 
                                type="text" 
                                placeholder="都道府県" 
                                {...register(`${question.section.index}-${question.question_index}-${question.id}-pref`, { 
                                    required: false,
                                })}
                            />
                        </div>
                        <div className="mt-4">
                            <input 
                                type="text" 
                                placeholder="市区町村" 
                                {...register(`${question.section.index}-${question.question_index}-${question.id}-city`, { 
                                    required: false,
                                })}
                            />
                        </div>
                        <div className="mt-4">
                            <input 
                                type="text" 
                                placeholder="番地" 
                                {...register(`${question.section.index}-${question.question_index}-${question.id}-town`, { 
                                    required: false,
                                })}
                            />
                        </div>
                    </div>
                ))}
                {errors[nameId] && <div style={{color: "red"}}>必須項目が未入力です</div>}
            </div>
        )
    } else if(question.type === 7) {
        return(
            <div>
                {question.fields.map((field) => (
                    <div key={field.id}>
                        <input 
                            type="file" 
                            {...register(nameId, { required: question.required === 0 ? false : true })}
                            id={nameId}
                        />
                        {}
                    </div>
                ))}
                {errors[nameId] && <div style={{color: "red"}}>必須項目が未入力です</div>}
            </div>
        )
    }
}
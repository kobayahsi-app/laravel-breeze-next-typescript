import laravelAxios from "@/lib/laravelAxios";
import { FieldType } from "@/types/Field";
import { QuestionType } from "@/types/Question";
import { IconButton } from "@mui/material";
import FileCopyIcon from '@mui/icons-material/FileCopy';

function switchSubFieldType(
  type: number,
  fields: FieldType[],
  dragIndex: number | null,
  setDragIndex: React.Dispatch<React.SetStateAction<number | null>>,
  questions: QuestionType[],
  setQuestions: React.Dispatch<React.SetStateAction<QuestionType[]>>,
  qsIndex: number,
  subQsIndex: number,
) {

  const dragStartField = (index: number) => {
    setDragIndex(index);
  }

  const dragEnterField = (fieldIndex: number) => {
    if(fieldIndex === dragIndex) return;
    setQuestions((prevState) => {
      // questions配列をコピー
      let newQuestions = JSON.parse(JSON.stringify(prevState));
      // questionの指定
      const targetQuestion = newQuestions[qsIndex];
      // sub_quesitonの指定
      const targetSubQuestion = targetQuestion.sub_questions[subQsIndex];
      // 指定したsub_questionsを展開
      let fields = [...targetSubQuestion.fields];
      const removed = fields.splice(dragIndex!, 1)[0];
      fields.splice(fieldIndex, 0, removed);
      targetSubQuestion.fields = fields;
      return newQuestions;
    });

    setDragIndex(fieldIndex);
  }

  const updateFieldIndex = async(fieldIndex: number, fieldId: number) => {
    try {
      await laravelAxios.put(`api/fieldIndex/${fieldId}`, {
        field_index: fieldIndex
      });
    } catch(error) {
      console.log(error);
    }
  }

  const dragEndField = () => {
    const targetQuestion = questions[qsIndex];
    const targetSubQuestion = targetQuestion.sub_questions[subQsIndex];
    for (let i = 0; i < targetSubQuestion.fields.length; i++) {
      const field = targetSubQuestion.fields[i];
      if(field.field_index === i) continue;
      updateFieldIndex(i, field.id);
    }
    setDragIndex(null);
  };
  if(type === 0 || type === 1) {
      return(
        <div className='flex justify-start'>
          {fields.map((field, fieldIndex) => (
              <div 
                draggable={true}
                key={field.id} 
                className='mr-4 flex justify-start items-center'
                onDragStart={() => dragStartField(fieldIndex)}
                onDragEnter={() => dragEnterField(fieldIndex)}
                onDragOver={(event) => event.preventDefault()}
                onDragEnd={() => dragEndField()}
              >
                <input readOnly type="radio" />
                <label htmlFor="">{field.title}</label>
              </div>
          ))}
        </div>
      )
  } else if(type === 2) {
      return (
        <div className='mr-4 flex justify-start items-center'>
            {fields.map((field, fieldIndex) => (
                <div 
                  draggable={true}
                  key={field.id} 
                  className='mr-4'
                  onDragStart={() => dragStartField(fieldIndex)}
                  onDragEnter={() => dragEnterField(fieldIndex)}
                  onDragOver={(event) => event.preventDefault()}
                  onDragEnd={() => dragEndField()}
                >
                  <label htmlFor="">{field.title}</label>
                  <input readOnly type="checkbox" />
                </div>
            ))}
          </div>
      )
  } else if(type === 3) {
      return (
        <div className='flex justify-start'>
          {fields.map((field) => (
              <div key={field.id} className='mr-4'>
                <label htmlFor="">{field.title}</label>
                <input readOnly type="text" placeholder={field.value} value="" />
              </div>
          ))}
        </div>
      )
  } else if(type === 4) {
      return(
        <div className='flex justify-start'>
          {fields.map((field) => (
              <div key={field.id} className='mr-4'>
                <label htmlFor="">{field.title}</label>
                <textarea readOnly rows={4} placeholder={field.value}></textarea>
              </div>
          ))}
        </div>
      ) 
  } else if(type === 5) {
      return (
        <div className='flex justify-start'>
          {fields.map((field) => (
              <div key={field.id} className='mr-4'>
                <label htmlFor="">{field.title}</label>
                <input readOnly type="date" />
              </div>
          ))}
        </div>
      )
  } else if(type === 6) {
    return (
      <div className=''>
        {fields.map((field) => (
            <div key={field.id} className="mt-2">
              <label htmlFor="">{field.title}</label>
              <input readOnly type="text" placeholder={field.value} value="" />
            </div>
        ))}
      </div>
    )
  } else if(type === 7) {
    return (
      <IconButton>
        <FileCopyIcon />
      </IconButton>
    )
  } else {
      <div style={{display: 'none'}}></div>
  }
}

export default switchSubFieldType;
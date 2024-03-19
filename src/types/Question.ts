import { FieldType } from "./Field"
import { SectionType } from "./Section"
import { SubQuestionType } from "./SubQuestion"

export interface QuestionType {
    id: number
    section_id: number
    type: number
    title: string
    question_index: number
    required: number
    section: SectionType
    sub_questions: SubQuestionType[]
    fields: FieldType[]
}
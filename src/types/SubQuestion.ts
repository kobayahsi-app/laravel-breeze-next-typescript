import { FieldType } from "./Field"
import { SectionType } from "./Section"

export interface SubQuestionType {
    id: number
    section_id: number
    question_id: number
    type: number
    title: string
    terms: string
    required: number
    section: SectionType
    question_index: number
    fields: FieldType[]
}
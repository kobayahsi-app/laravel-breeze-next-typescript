import { FieldType } from "./Field"
import { QuestionType } from "./Question"
import { SheetType } from "./Sheet"

export interface SectionType {
    id: number
    index: number
    sheet_id: string
    title: string
    description: string
    connect_question: number
    connect_answer: string
    sheet: SheetType
    questions: QuestionType[]
    fields: FieldType[]
}
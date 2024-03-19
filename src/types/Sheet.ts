import { SectionType } from "./Section"
import { UserType } from "./User"

export interface SheetType {
    id: number
    title: string
    description: string
    theme_color: string
    public: boolean
    slug: string
    user_id: number
    user: UserType
    sections: SectionType[]
}
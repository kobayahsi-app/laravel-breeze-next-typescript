import { SheetType } from "./Sheet"

export interface UserType {
  id: number
  clinic_id: string
  img_path: string
  email: string
  clinic_name: string
  clinic_path: string
  email_verified_at?: Date
  created_at: Date
  updated_at: Date
  sheets: SheetType[]
}

'use client'
import laravelAxios from '@/lib/laravelAxios'
import { SheetType } from '@/types/Sheet'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Sheets() {
  const [sheets, setSheets] = useState<SheetType[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSheets = async() => {
      try {
        const response = await laravelAxios.get('api/sheets')
        setSheets(response.data);
      } catch(error) {
        console.log(error);
      }
    }
    fetchSheets();
  }, [])
  return (
    <div className='py-12'>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <h2>問診票</h2>
            {sheets.length > 0 && (
              sheets.map((sheet) => (
                <div className='py-10' key={sheet.id}>
                  <ul className='flex justify-between'>
                    <li style={{fontWeight: "bold"}}>{sheet.title}</li>
                    <li>{sheet.description}</li>
                    <li 
                      style={{fontWeight: "bold"}}
                    >
                      {sheet.public == false ? "非公開" : "公開"}
                    </li>
                    <li 
                      style={{color: "white"}} 
                      className='cursor-pointer bg-gray-500 px-5 py-4'
                      onClick={() => router.push(`/admin/create_section/${sheet.id}`)}
                    >セクション追加</li>
                    <li 
                      style={{color: "white"}} 
                      className='cursor-pointer bg-gray-500 px-5 py-4'
                    >プレビュー</li>
                    <li 
                      style={{color: "white"}} 
                      className='cursor-pointer bg-gray-500 px-5 py-4' 
                      onClick={() => router.push(`/admin/edit_sheet/${sheet.id}`)}
                    >編集</li>
                  </ul>
                </div>
              ))
            )}
            <Link href={`/admin/create_sheet`}>
                <div className='create_button'>
                    新規追加
                </div>
            </Link>
        </div>
    </div>
  )
}

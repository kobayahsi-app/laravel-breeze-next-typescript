'use client'
import laravelAxios from '@/lib/laravelAxios';
import { UserType } from '@/types/User'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Clinic({ params }: { params: { clinicPath: string } }) {
  const clinicPath = params.clinicPath;
  const router = useRouter();
  const [medical, setMedical] = useState<UserType | null>(null);

  useEffect(() => {
    if(!clinicPath) return;

    const fetchMedical = async() => {
      try {
        const response = await laravelAxios.get(`api/user/${clinicPath}`);
        setMedical(response.data);
      } catch(error) {
        console.log(error)
      }
    }

    fetchMedical();
  }, []);
  return (
    <div className='p-10 w-ful'>
      <div className='m-auto w-4/5 flex flex-col items-center medical-root'>
        {medical?.img_path !== undefined ? (
          <Image src={`/logo/${medical?.img_path}`} alt='ロゴ' width={300} height={500} />
        ) : (
          <div></div>
        )}
        <h1>{medical?.clinic_name}</h1>
        <div>
          {medical?.sheets !== undefined && (
            medical?.sheets.map((sheet) => (
              <div key={sheet.id} onClick={() => router.push(`/${clinicPath}/${sheet.slug}`)} className='sheet_item'>
                <h3>{sheet.title}</h3>
                <h3>{sheet.description}</h3>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

'use client'
import laravelAxios from '@/lib/laravelAxios';
import { UserType } from '@/types/User';
import { Card, Typography } from '@mui/material';
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter();
  const [medicals, setMedicals] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchData = async() => {
      const response = await laravelAxios.get('api/users');
      setMedicals(response.data);
    }
    fetchData();
  }, [])
  return (
    <>
      <Head>
        <title>Laravel</title>
      </Head>
      <div className="relative flex items-top flex-col justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
        <h1>医院一覧</h1>
        <div>
          {medicals.length > 0 && (
            medicals.map((medical) => (
              <Link href={`/${medical.clinic_path}`} key={medical.clinic_id}>
                <Card className='py-5 px-5 cursor-pointer'>
                  <Typography>{medical.clinic_name}</Typography>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  )
}

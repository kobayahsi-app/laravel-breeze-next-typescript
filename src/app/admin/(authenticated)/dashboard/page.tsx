'use client'
import { useAuth } from '@/hooks/auth'
import { Button } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'

const DashboardPage = () => {
  const { user } = useAuth({middleware: 'auth'});
  const router = useRouter();
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            <table>
              <tbody>
                <tr>
                  <th>クリニック名</th>
                  <td>{user?.clinic_name}</td>
                </tr>
                <tr>
                  <th>ロゴ</th>
                  <td>
                    <Image src={`/logo/${user?.img_path}`} alt='ロゴ' width={64} height={64} />
                  </td>
                </tr>
                <tr>
                  <th>クリニックID</th>
                  <td>{user?.clinic_id}</td>
                </tr>
                <tr>
                  <th>スラッグ</th>
                  <td>https://xxxx.com/{user?.clinic_path}</td>
                </tr>
                <tr>
                  <th>メールアドレス</th>
                  <td>{user?.email}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Button onClick={() => router.push('/admin/edit_account')}>編集</Button>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

'use client'
import { useAuth } from '@/hooks/auth';
import laravelAxios from '@/lib/laravelAxios';
import { Button } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function EditAccount() {
    const { user } = useAuth({middleware: 'auth'});
    const router = useRouter();
    const [clinicName, setClinicName] = useState<string>('');
    const [clinicPath, setClinicPath] = useState<string>('');
    const [imgPath, setImgPath] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File>();

    const inputClinicName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClinicName(e.target.value);
    }
    const inputClinicPath = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClinicPath(e.target.value);
    }

    useEffect(() => {
        setClinicName(user?.clinic_name);
        setClinicPath(user?.clinic_path);
        setImgPath(user?.img_path)
    }, [user])

    const handleUpload = async() => {
        try {
          if(!selectedFile) return;
          const formData = new FormData();
          formData.append("file", selectedFile);
          await axios.post('/api/image', formData);
        } catch (error: any) {
          console.log(error.response?.data);
        }
    }

    const handleUpdate = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const filename = selectedFile?.name.replaceAll(" ", "_");
        try {
            const response = await laravelAxios.put(`api/user/${user.id}`, {
                clinic_name: clinicName,
                clinic_path: clinicPath,
                img_path: selectedFile ? filename : "none",
            });
            handleUpload();
        } catch(error) {
            console.log(error);
        } finally {
            router.push('/admin/dashboard')
        }
    }
    return (
        <div className='py-12'>
            <section className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <h2>ユーザー情報編集</h2>
                <div className='form my-10'>
                    <form onSubmit={handleUpdate}>
                        <label
                            className="undefined block font-medium text-sm text-gray-700">
                            クリニックロゴ
                            <input
                                type="file"
                                id="img_path"
                                name="img_path"
                                hidden
                                onChange={({ target }) => {
                                    if (target.files) {
                                        const file = target.files[0];
                                        setSelectedImage(URL.createObjectURL(file));
                                        setSelectedFile(file);
                                    }
                                }}
                            />
                            <div className="w-40 aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer">
                                {selectedImage ? (
                                    <img src={selectedImage} alt="" />
                                ) : user?.img_path !== "" ? (
                                    <Image src={`/logo/${user?.img_path}`} alt='ロゴ' width={65} height={65} />
                                ) : (
                                    <span>Select Image</span>
                                )}
                            </div>
                            {selectedFile?.name}
                        </label>
                        <div className='form_item my-5'>
                            <label htmlFor="clinic_name">クリニック名</label>
                            <input 
                                value={clinicName} 
                                onChange={inputClinicName} 
                                type="text" 
                                name='clinic_name' 
                                id='clinic_name' 
                            />
                        </div>
                        <div className='form_item my-5'>
                            <label htmlFor="clinic_path">スラッグ</label>
                            <input 
                                value={clinicPath} 
                                onChange={inputClinicPath} 
                                type="text" 
                                name='clinic_path' 
                                id='clinic_path' 
                            />
                        </div>
                        <Button 
                            variant='contained' 
                            type='submit'
                            style={{
                                backgroundColor: '#1976d2',
                                color: '#fff',
                            }}
                        >編集</Button>
                    </form>
                </div>
            </section>
        </div>
    )
}

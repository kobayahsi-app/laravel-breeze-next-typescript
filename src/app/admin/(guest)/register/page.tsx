'use client'
import Link from 'next/link'
import * as Yup from 'yup'
import axios, { AxiosError } from 'axios'
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'

import { useAuth } from '@/hooks/auth'
import ApplicationLogo from '@/components/ApplicationLogo'
import AuthCard from '@/components/AuthCard'
import { useState } from 'react'

interface Values {
  clinic_name: string
  img_path: string
  clinic_id: string
  email: string
  password: string
  password_confirmation: string
  clinic_path: string
}

const RegisterPage = () => {
  const { register } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/admin/dashboard',
  })
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File>();

  const handleUpload = async() => {
    setUploading(true);
    try {
      if(!selectedFile) return;

      const formData = new FormData();
      formData.append("file", selectedFile);
      // fetch("/api/image", {
      //   method: "DELETE",
      //   body: formData,
      // });
      await axios.post('/api/image', formData);
      setUploading(false);
    } catch (error: any) {
      console.log(error.response?.data);
      setUploading(false);
    }
  }

  const submitForm = async (
    values: Values,
    { setSubmitting, setErrors }: FormikHelpers<Values>,
  ): Promise<any> => {
    try {
      if(selectedFile) {
        const filename = selectedFile.name.replaceAll(" ", "_");
        values.img_path = filename;
      }
      console.log(values.img_path, 'path')
      await register(values)
      await handleUpload();
    } catch (error: Error | AxiosError | any) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        setErrors(error.response?.data?.errors)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const RegisterSchema = Yup.object().shape({
    clinic_name: Yup.string().required('クリニック名を入力してください。'),
    email: Yup.string()
      .email('メールアドレスの形式が間違っています。')
      .required('メールアドレスを入力してください。'),
    password: Yup.string().required('パスワードを入力してください。'),
    password_confirmation: Yup.string()
      .required('確認用パスワードを入力してください。')
      .oneOf([Yup.ref('password')], '入力したパスワードが一致しません。'),
  })

  return (
    <AuthCard
      logo={
        <Link href="/">
          <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
        </Link>
      }>
      <Formik
        onSubmit={submitForm}
        validationSchema={RegisterSchema}
        initialValues={{
          clinic_name: '',
          img_path: '',
          clinic_id: '',
          email: '',
          password: '',
          password_confirmation: '',
          clinic_path: '',
        }}>
        <Form className="space-y-4">
          <div>
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
                ) : (
                  <span>Select Image</span>
                )}
              </div>
              {selectedFile?.name}
            </label>
            <ErrorMessage
              name="img_path"
              component="span"
              className="text-xs text-red-500"
            />
          </div>
          <div>
            <label
              htmlFor="clinic_name"
              className="undefined block font-medium text-sm text-gray-700">
              クリニック名
            </label>

            <Field
              id="clinic_name"
              name="clinic_name"
              className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />

            <ErrorMessage
              name="clinic_name"
              component="span"
              className="text-xs text-red-500"
            />
          </div>

          <div>
            <label
              htmlFor="clinic_path"
              className="undefined block font-medium text-sm text-gray-700">
              クリニックパス
            </label>

            <Field
              id="clinic_path"
              name="clinic_path"
              className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />

            <ErrorMessage
              name="clinic_path"
              component="span"
              className="text-xs text-red-500"
            />
          </div>

          <div>
            <label
              htmlFor="clinic_id"
              className="undefined block font-medium text-sm text-gray-700">
              クリニックID
            </label>
            <Field
              id="clinic_id"
              name="clinic_id"
              className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />

            <ErrorMessage
              name="clinic_id"
              component="span"
              className="text-xs text-red-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="undefined block font-medium text-sm text-gray-700">
              メールアドレス
            </label>

            <Field
              id="email"
              name="email"
              type="email"
              className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />

            <ErrorMessage
              name="email"
              component="span"
              className="text-xs text-red-500"
            />
          </div>

          <div className="">
            <label
              htmlFor="password"
              className="undefined block font-medium text-sm text-gray-700">
              パスワード
            </label>

            <Field
              id="password"
              name="password"
              type="password"
              className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />

            <ErrorMessage
              name="password"
              component="span"
              className="text-xs text-red-500"
            />
          </div>

          <div className="">
            <label
              htmlFor="password"
              className="undefined block font-medium text-sm text-gray-700">
              パスワード確認
            </label>

            <Field
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />

            <ErrorMessage
              name="password_confirmation"
              component="span"
              className="text-xs text-red-500"
            />
          </div>

          <div className="flex items-center justify-end mt-4">
            <Link
              href="/"
              className="underline text-sm text-gray-600 hover:text-gray-900">
              すでにアカウントをお持ちの方
            </Link>

            <button
              type="submit"
              className="ml-4 inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150">
              登録
            </button>
          </div>
        </Form>
      </Formik>
    </AuthCard>
  )
}

export default RegisterPage

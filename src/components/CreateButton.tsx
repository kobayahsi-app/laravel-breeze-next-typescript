import React from 'react'

type Props = {
    onClick: React.MouseEvent<HTMLInputElement>
    content: string
}
export default function CreateButton({ onClick, content }: Props) {
  return (
    <div className='create_button'>
        <button onClick={() => onClick}>{content}</button>
    </div>
  )
}

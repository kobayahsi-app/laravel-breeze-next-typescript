import { SectionType } from '@/types/Section'
import { Edit } from '@mui/icons-material'
import { Button, Card, CardActions, CardContent, Grid, IconButton, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
    section: SectionType,
    sheetId: number,
}
export default function SectionCard({ section, sheetId }: Props) {
    const router = useRouter();
    return (
        <Grid 
            className='cursor-pointer' 
            item xs={12} sm={6} md={4} lg={3} 
            key={section.id}
        >
            <Card>
                <CardContent>
                    <Typography className='my-3' variant='h5'>{section.title}</Typography>
                    <Typography>{section.description}</Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={() => router.push(`/create_questions/${section.id}`)} size='small'>質問を作成</Button>
                    <IconButton onClick={() => router.push(`/edit_section/${sheetId}/${section.id}`)}>
                        <Edit />
                    </IconButton>
                </CardActions>
            </Card>
        </Grid>
    )
}

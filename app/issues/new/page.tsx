'use client'
import axios from 'axios'
import { Button, Callout, Spinner, TextField } from '@radix-ui/themes'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod';
import { createIssueSchema } from '@/app/ValidationSchemas'
import { z } from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage'
// Dynamically import SimpleMDE with SSR disabled
const SimpleMDE = dynamic(
  () => import('react-simplemde-editor'),
  { ssr: false }
)
type IssueForm = z.infer<typeof createIssueSchema>;




const NewIssuePage = () => {

   const {register , control , handleSubmit , formState : {errors}} = useForm<IssueForm>({resolver: zodResolver(createIssueSchema)});

   const [error, setError] = useState("");

const router = useRouter();
const [isSubmitting, setIsSubmitting] = useState(false);

  return (
<div className='max-w-xl'>

{error && <Callout.Root color='red' className='mb-5'>
    
    <Callout.Text>{error}</Callout.Text>
    </Callout.Root>}

<form onSubmit={handleSubmit(async (data)=>{ 
        
        try{
            
            setIsSubmitting(true);
            await axios.post('/api/issues',data);
            setIsSubmitting(false);
        router.push('/issues')}catch(error){setError("An error occurred while creating the issue. Please try again ");}
        
    })} className='max-w-xl space-y-3'>
      <TextField.Root placeholder="Enter the title of the issue" {...register('title')} />
  <ErrorMessage>{errors.title?.message}</ErrorMessage>
      <Controller 
      name="description"
      control={control}
      render  ={({field})=><SimpleMDE placeholder="Enter the description of the issue"  {...field}/>}
/>
<ErrorMessage>{errors.description?.message}</ErrorMessage>
      <Button>Submit<Spinner/></Button>
    </form>
</div>

    
  )
}

export default NewIssuePage

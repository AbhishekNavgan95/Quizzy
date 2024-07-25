import { useSelector } from 'react-redux';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../components/Button';
import RequiredError from '../components/RequiredError';
import toast from 'react-hot-toast';
import { createQuiz } from '../services/operations/QuizAPIs';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {

  // const [createdQuiz, setCreatedQuiz] = useState(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate()

  const submitHandler = async (data) => {
    console.log(data);

    try {
      const response = await createQuiz(data, token);
      if (response) {
        // setCreatedQuiz(response);
        setValue("title", "")
        setValue("description", "")
        setValue("timer", "")

        console.log("response: ", response)
        // dispatch(setQuiz(response))
        navigate("/dashboard/create-quiz/" + response._id)
      }
    } catch (e) {
      console.log(e);
      toast.error("Quiz cannot be created at this moment")
    }
  }

  return (
    <div className='min-h-[70vh] flex justify-center flex-col items-center gap-10'>
      <h3 className='text-3xl underline text-center'>Create Quiz</h3>
      <form onSubmit={handleSubmit(submitHandler)} className='w-full max-w-[480px] border mx-auto py-10 flex flex-col gap-5 p-10 rounded-lg shadow-lg shadow-blue-400'>
        <span className='flex flex-col gap-2'>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            placeholder='Enter Title'
            id='title'
            className='py-1 text-base  placeholder:text-black text-slate-950 rounded-lg px-3 outline-none bg-slate-300 xl:text-xl'
            {
            ...register("title", {
              required: "Title is required",
            })
            }
          />
          {
            errors.title && <RequiredError>{errors.title.message}</RequiredError>
          }
        </span>
        <span className='flex flex-col gap-2'>
          <label htmlFor="description">Description</label>
          <textarea
            placeholder='Enter Description'
            type="text"
            rows={4}
            id='description'
            className='py-1 text-base resize-none placeholder:text-black text-slate-950 rounded-lg px-3 outline-none bg-slate-300 xl:text-xl'
            {
            ...register("description")
            }
          ></textarea>
          {
            errors.description && <RequiredError>{errors.description.message}</RequiredError>
          }
        </span>
        <span className='flex flex-col gap-2'>
          <label htmlFor="timer">Time (minutes)</label>
          <input
            type="number"
            placeholder='5.00'
            id='timer'
            min={5}
            max={60}
            {
            ...register("timer", { required: "Time is required" })
            }
            className='py-1 text-base  placeholder:text-black text-slate-950 rounded-lg px-3 outline-none bg-slate-300 xl:text-xl'
          />
        </span>
        {
          errors.timer && <RequiredError>{errors.timer.message}</RequiredError>
        }
        <span>
          <Button type='submit'>Create</Button>
        </span>
        {/* {
          createdQuiz && (
            <div className='self-end'>
              <Button>Add Quesitons</Button>
            </div>
          )
        } */}
      </form>

    </div>
  )
}

export default CreateQuiz
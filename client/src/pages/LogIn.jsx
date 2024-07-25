import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../components/Button'
import RequiredError from '../components/RequiredError'
import { login } from '../services/operations/AuthAPIs'
import HighLightText from '../components/HighLightText'
import { TbEyeClosed, TbEyeCheck } from "react-icons/tb";


const LogIn = () => {

  const [hidePassword, setHidePassword] = useState(true)
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (data) => {
    // console.log("data : ", data)
    setLoading(true);
    try {
      const response = await login(data, dispatch)
      if (response) {
        navigate("/")
      }
    } catch (e) {
      console.log("ERROR WHILE SINGING UP : ", e);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center '>
      <section>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className='flex flex-col gap-y-3 max-w-[480px] shadow-lg shadow-blue-300  border p-10 rounded-lg'
        >
          <div>
            <h3 className='text-4xl pb-5 text-center leading-[1.125]'>
              Log in to Your Account
            </h3>
          </div>

          <span className='flex flex-col gap-1'>
            <label htmlFor="email">Email</label>
            <input
              id='email'
              placeholder='Enter your Email'
              className='py-1 text-base  placeholder:text-black text-slate-950 rounded-lg px-3 outline-none bg-slate-300 xl:text-xl'
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            {
              errors?.email && <RequiredError>{errors.email.message}</RequiredError>
            }
          </span>

          <span className='flex flex-col gap-1'>
            <label htmlFor="password">Password</label>
            <span className='flex items-center w-full'>
              <input
                id='password'
                placeholder='Enter your password'
                className='py-1 text-base  placeholder:text-black text-slate-950 w-full rounded-lg px-3 outline-none bg-slate-300 xl:text-xl'
                type={hidePassword ? "password" : "text"}
                {...register("password", { required: "Password is required" })}
              />
              <span
                className='p-3 cursor-pointer'
                onClick={() => setHidePassword(!hidePassword)}
              >
                {
                  !hidePassword ? <TbEyeClosed /> : <TbEyeCheck />
                }</span>
            </span>
            {
              errors?.password && <RequiredError>{errors.password.message}</RequiredError>
            }
          </span>

          <span className='mt-5'>
            <Button disabled={loading} varient={"primary"} type={"submit"}>Submit</Button>
          </span>

        </form>
      </section >
    </div >
  )
}

export default LogIn
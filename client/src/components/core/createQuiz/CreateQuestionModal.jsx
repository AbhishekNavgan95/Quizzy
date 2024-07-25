import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../Button';
import { IoAdd, IoClose } from "react-icons/io5";
import { apiConnector } from '../../../services/apiConnector';
import { createQuestion } from '../../../services/operations/questionAPIs';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const CreateQuestionModal = ({ quiz, setQuestions, setCreateQuestionModalData }) => {
  const [options, setOptions] = useState([]);
  const [currentOption, setCurrentOption] = useState('');
  const [isCurrentOptionCorrect, setIsCurrentOptionCorrect] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { token } = useSelector(state => state.auth);

  const submitHandler = async (data) => {
    data.options = options;
    data.quizId = quiz._id;

    try {
      const response = await createQuestion(data, token)

      if (response) {
        setQuestions(prevQuestions => [...prevQuestions, response]);
        setCreateQuestionModalData(null);
      }

    } catch (e) {
      console.log("ERROR WHILE CREATING THE QUESTION : ", e);
      toast.error("question cannot be created")
    }

  };

  const addOption = () => {
    if (isCurrentOptionCorrect && options.some(option => option.isCorrect)) {
      alert("There can be only one correct option.");
      return;
    }
    setOptions([...options, { text: currentOption, isCorrect: isCurrentOptionCorrect }]);
    setCurrentOption('');
    setIsCurrentOptionCorrect(false);
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <div className='absolute flex justify-start p-10 gap-10 flex-col items-center bg-slate-700 rounded-lg border border-slate-600 inset-0'>

      <h3 className='text-2xl'>Create a question</h3>

      <form onSubmit={handleSubmit(submitHandler)} className='w-full max-w-[480px] flex flex-col gap-5'>

        <span className='flex flex-col gap-3'>
          <label htmlFor="questionText">Enter Question</label>
          <input
            type="text"
            placeholder='Enter Question here'
            className='py-1 text-base placeholder:text-black text-slate-950 rounded-lg px-3 outline-none bg-slate-300 xl:text-xl'
            {...register("questionText", {
              required: "Question is required",
            })}
          />
          {errors.questionText && <p className='text-red-500'>{errors.questionText.message}</p>}
        </span>

        <span className='flex flex-col gap-3'>
          <label htmlFor="options">Add Options</label>
          <span className='flex items-center flex-col gap-2'>
            <input
              type="text"
              placeholder='Create Options'
              className='py-1 text-base w-full placeholder:text-black text-slate-950 rounded-lg px-3 outline-none bg-slate-300 xl:text-xl'
              value={currentOption}
              onChange={(e) => setCurrentOption(e.target.value)}
            />
            <span className='flex items-center gap-2 self-start  justify-between w-full'>
              <span className='space-x-2'>
                <input
                  type="checkbox"
                  name="isCorrect"
                  id="isCorrect"
                  checked={isCurrentOptionCorrect}
                  onChange={() => setIsCurrentOptionCorrect(!isCurrentOptionCorrect)}
                />
                <label htmlFor="isCorrect">Correct option?</label>
              </span>
              <button onClick={addOption} className='p-2 text-lg flex items-center' type='button'><IoAdd /> Add</button>
            </span>
          </span>
        </span>

        <span>
          {
            options.map((option, index) => (
              <div key={index} className='flex gap-2 items-center'>
                <p>{option.text}</p>
                {option.isCorrect && <span className='text-green-500'>(Correct)</span>}
                <button type='button' onClick={() => removeOption(index)} className='text-red-500'><IoClose /></button>
              </div>
            ))
          }
        </span>

        <span className='flex justify-end w-full gap-3'>
          <Button onClick={() => setCreateQuestionModalData(null)} className='w-max h-max' active={false}>Cancel</Button>
          <Button type="submit" className='w-max h-max' active>Create</Button>
        </span>
        
      </form>
    </div>
  );
}

export default CreateQuestionModal;

import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { apiConnector } from "../services/apiConnector"
import { quizEndpoints } from "../services/APIs/index"
import QuizCard from '../components/core/Home/QuizCard'

const Home = () => {

  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useSelector(state => state.auth)

  const fetchQuizzes = async () => {
    setLoading(true)
    try {
      const response = await apiConnector("GET", quizEndpoints.GET_ALL_QUIZES, null, {
        Authorization: `Bearer ${token}`
      })

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      console.log("res : ", response);

      setQuizzes(response.data.data);

    } catch (e) {
      console.log("COULDNT GET QUIZZES")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuizzes();
  }, [])

  return (
    <section className='min-h-screen border-t border-slate-600 py-5 my-3 '>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3 lg:grid-cols-3'>
        {
          loading
            ? <h1>Loading...</h1>
            : !loading && quizzes?.length > 0
              ? quizzes.map((quiz, index) => (
                <QuizCard key={quiz._id} quiz={quiz} index={index} />
              )) : <p>No quizzes found</p>
        }
      </div>
    </section>
  )
}

export default Home
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Attempt = require("../models/Attempt");

// ✅
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, timer } = req.body;
    const user = req.user;

    if (!title || !description || !timer) {
      return res.status(400).json({
        success: false,
        error: "Please provide all the required fields",
      });
    }

    const quiz = await Quiz.create({
      title,
      description,
      timer,
      createdBy: user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (e) {
    console.log("ERROR CREATING QUIZ: ", e);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅
exports.updateQuiz = async (req, res) => {
  try {
    const { title, description, timer } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    quiz.title = title;
    quiz.description = description;
    quiz.timer = timer;

    await quiz.save();

    return res.status(200).json({
      success: true,
      error: "Quiz updated successfully",
      quiz,
    });
  } catch (e) {
    console.log("ERROR UPDATING QUIZ : ", e);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ⚙️
exports.deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    const questions = await Question.find({ quiz: quizId });

    for (const question of questions) {
      await Question.findByIdAndDelete(question._id);
    }

    await Quiz.findByIdAndDelete(quizId);

    return res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (e) {
    console.log("ERROR DELETING QUIZ : ", e);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    return res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (e) {
    console.log("ERROR GETTING QUIZZES : ", e);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅
exports.getQuizById = async (req, res) => {
  try {
    const quizId = req.params.id;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }
    return res.status(200).json({
      success: true,
      quiz,
    });
  } catch (e) {
    console.log("ERROR GETTING QUIZ : ", e);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ⚙️
exports.attemptQuiz = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming req.user is set by the auth middleware
    const { quizId, answers } = req.body;

    // Fetch the quiz details
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, error: "Quiz not found" });
    }

    // Fetch all questions for the quiz
    const questions = await Question.find({ quizId });

    // Validate and calculate score
    let score = 0;
    const answersArray = [];

    for (const question of questions) {
      const userAnswer = answers.find(
        (ans) => ans.questionId === question._id.toString()
      );
      if (userAnswer) {
        const selectedOption = question.options.id(userAnswer.selectedOption);
        if (selectedOption && selectedOption.isCorrect) {
          score += 1; // Increment score for correct answer
        }
        answersArray.push({
          questionId: question._id,
          selectedOption: userAnswer.selectedOption,
        });
      }
    }

    // Record the attempt
    const attempt = new Attempt({
      userId,
      quizId,
      score,
      answers: answersArray,
    });
    await attempt.save();

    return res.status(200).json({
      success: true,
      success: "Quiz attempted successfully",
      score,
    });
  } catch (e) {
    console.error("ERROR ATTEMPTING QUIZ:", e.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ⚙️
exports.getUserAttempts = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming req.user is set by the auth middleware

    // Fetch all attempts by the user
    const attempts = await Attempt.find({ userId }).populate(
      "quizId",
      "title description"
    );

    return res.status(200).json({
      success: true,
      attempts,
    });
  } catch (e) {
    console.error("ERROR FETCHING USER ATTEMPTS:", e.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
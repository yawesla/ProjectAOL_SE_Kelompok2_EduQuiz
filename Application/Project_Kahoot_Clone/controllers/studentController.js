const { User, Participant, Quiz, Question, Answer } = require("../models");

class studentController {
  static async joinQuiz(req, res, next) {
    try {
      const { code, username } = req.body;
      if (!code || !username) {
        throw { name: "BadRequest", message: "Code and username are required" };
      }

      const quiz = await Quiz.findOne({ where: { code } });

      if (!quiz) {
        throw { name: "NotFound", message: "Quiz not found" };
      }

      // Cek apakah username sudah ada di quiz yang sama
      const existing = await Participant.findOne({
        where: {
          quizId: quiz.id,
          username: username,
        },
      });

      if (existing) {
        throw {
          name: "Conflict",
          message: "Username already taken in this quiz",
        };
      }

      const participant = await Participant.create({
        userId: req.user.id,
        quizId: quiz.id,
        username,
        score: 0,
        joinTime: Date.now(),
      });
      console.log(
        "🚀 ~ studentController ~ joinQuiz ~ participant:",
        participant
      );

      res.status(201).json({
        message: "Successfully joined quiz",
        participantId: participant.id,
        quizId: quiz.id,
        code: quiz.code,
        username: participant.username,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getTotalQuestions(req, res, next) {
    try {
      const { quizId } = req.params;
      const count = await Question.count({
        where: { quizId },
      });
      console.log("🚀 ~ studentController ~ getTotalQuestions ~ count:", count);

      res.status(200).json({ totalQuestions: count });
    } catch (err) {
      next(err);
    }
  }

  static async getQuestion(req, res, next) {
    try {
      const { quizId, number } = req.params;
      const questions = await Question.findAll({
        where: { quizId },
        order: [["id", "ASC"]],
      });

      const index = parseInt(number) - 1;
      if (!questions[index]) {
        throw { name: "NotFound", message: "Question not found" };
      }

      const question = questions[index];

      res.status(200).json({
        questionId: question.id,
        questionText: question.questionText,
        options: {
          A: question.option_A,
          B: question.option_B,
          C: question.option_C,
          D: question.option_D,
        },
        questionNumber: parseInt(number),
      });
    } catch (err) {
      next(err);
    }
  }

  static async answerQuestions(req, res, next) {
    try {
      const { quizId, questionId } = req.params;
      const { participantId, chooseOption } = req.body;
      const participant = await Participant.findByPk(participantId);
      console.log("🚀 ~ studentController ~ answerQuestions ~ chooseOption:", chooseOption)
      
      if (!participant || participant.quizId != quizId) {
        throw {
          name: "NotFound",
          message: "Participant not found or not part of this quiz",
        };
      }

      const question = await Question.findByPk(questionId);
      if (!question || question.quizId != quizId) {
        throw { name: "NotFound", message: "Question not found" };
      }

      const isCorrect = question.correctOption === chooseOption;
      const score = isCorrect ? 100 : 0;

      const response = await Answer.create({
        participantId,
        questionId,
        chooseOption,
        isCorrect,
        score,
      });
      console.log(
        "🚀 ~ studentController ~ answerQuestions ~ response:",
        response
      );

      res.status(201).json({
        message: "Answer submitted",
        correct: isCorrect,
        score,
      });
    } catch (err) {
      next(err);
    }
  }

  static async answerResult(req, res, next) {
    try {
      const { quizId, questionId } = req.params;
      const { participantId } = req.query;
      const question = await Question.findByPk(questionId);
      if (!question || question.quizId != quizId) {
        throw { name: "NotFound", message: "Question not found" };
      }

      const response = await Answer.findOne({
        where: {
          participantId,
          questionId,
        },
      });

      if (!response) {
        throw { name: "NotFound", message: "Response not found" };
      }

      res.status(200).json({
        correct: response.isCorrect,
        yourAnswer: response.selectedOption,
        correctAnswer: question.correctOption,
        score: response.score,
      });
    } catch (err) {
      next(err);
    }
  }

  static async viewResult(req, res, next) {
    try {
      const { quizId } = req.params;
      const { participantId } = req.query;
      const participant = await Participant.findByPk(participantId);
      if (!participant || participant.quizId != quizId) {
        throw { name: "NotFound", message: "Participant not found" };
      }

      const responses = await Response.findAll({
        where: { participantId },
        include: {
          model: Question,
          attributes: ["questionText", "correctOption"],
        },
      });

      const totalScore = responses.reduce((acc, r) => acc + r.score, 0);

      res.status(200).json({
        participant: participant.username,
        totalScore,
        details: responses.map((r) => ({
          question: r.Question.questionText,
          yourAnswer: r.selectedOption,
          correctAnswer: r.Question.correctOption,
          score: r.score,
          correct: r.isCorrect,
        })),
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = studentController;

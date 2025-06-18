const { Quiz, Question } = require("../models");

class teacherController {
  static async createQuiz(req, res, next) {
    try {
      const { title } = req.body;
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const created = await Quiz.create({
        title,
        code,
        ownerId: req.user.id,
      });
      console.log("🚀 ~ teacherController ~ createQuiz ~ created:", created.dataValues)

      res.status(201).json({
        id: created.id,
        title: created.title,
        code: created.code,
        ownerId: created.ownerId,
      });
    } catch (err) {
      next(err);
    }
  }

  static async addQuestions(req, res, next) {
    try {
      const { quizId } = req.params;
      const {
        questionText,
        option_A,
        option_B,
        option_C,
        option_D,
        correctOption,
      } = req.body;
      const created = await Question.create({
        quizId,
        questionText,
        option_A,
        option_B,
        option_C,
        option_D,
        correctOption,
      });

      res.status(201).json({
        id: created.id,
        questionText: created.questionText,
        options: {
          A: created.option_A,
          B: created.option_B,
          C: created.option_C,
          D: created.option_D,
        },
        correctOption: created.correctOption,
        correctAnswer: created[`option_${created.correctOption}`],
      });
    } catch (err) {
      next(err);
    }
  }

  static async viewAllQuiz(req, res, next) {
    try {
      const quizzes = await Quiz.findAll({
        where: {
          ownerId: req.user.id,
        },
        include: {
          model: Question,
          attributes: ["id"], // to show how many questions (optional)
        },
      });

      const formatted = quizzes.map((q) => ({
        id: q.id,
        title: q.title,
        code: q.code,
        totalQuestions: q.Questions.length,
        createdAt: q.createdAt,
      }));

      res.status(200).json({
        statusCode: 200,
        data: formatted,
      });
    } catch (err) {
      next(err);
    }
  }

  static async quizDetail(req, res, next) {
    try {
      const { quizId } = req.params;
      // Cari quiz berdasarkan ID dan sertakan semua pertanyaannya
      const quiz = await Quiz.findByPk(quizId, {
        include: [
          {
            model: Question,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
      });

      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      // Format response
      res.status(200).json({
        id: quiz.id,
        title: quiz.title,
        code: quiz.code,
        ownerId: quiz.ownerId,
        questions: quiz.Questions.map((q) => ({
          id: q.id,
          questionText: q.questionText,
          options: {
            A: q.option_A,
            B: q.option_B,
            C: q.option_C,
            D: q.option_D,
          },
          correctOption: q.correctOption,
          correctAnswer: q[`option_${q.correctOption}`],
        })),
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteQuiz(req, res, next) {
    try {
      const { quizId } = req.params;
      // Cek apakah quiz ada dan dimiliki oleh user
      const quiz = await Quiz.findOne({
        where: {
          id: quizId,
          ownerId: req.user.id,
        },
      });

      if (!quiz) {
        return res
          .status(404)
          .json({ message: "Quiz not found or not owned by user" });
      }

      // Hapus semua questions terlebih dahulu jika tidak pakai cascade
      await Question.destroy({ where: { quizId } });

      // Hapus quiz-nya
      await quiz.destroy();

      res.status(200).json({ message: "Quiz successfully deleted" });
    } catch (err) {
      next(err);
    }
  }

  static async deleteQuestions(req, res, next) {
    try {
      const { quizId, questionId } = req.params;
      // Cek apakah question ada dan milik quiz milik user
      const question = await Question.findOne({
        where: {
          id: questionId,
          quizId,
        },
        include: {
          model: Quiz,
          where: {
            ownerId: req.user.id,
          },
        },
      });

      if (!question) {
        return res
          .status(404)
          .json({ message: "Question not found or not owned by user" });
      }

      await question.destroy();

      res.status(200).json({ message: "Question successfully deleted" });
    } catch (err) {
      next(err);
    }
  }

  static async viewLeaderboard(req, res, next) {
    try {
      const { quizId } = req.params;
      // Validasi quiz milik siapa (opsional, hanya jika kamu ingin batasi quiz milik teacher itu saja)
      const quiz = await Quiz.findOne({
        where: { id: quizId, ownerId: req.user.id },
      });

      if (!quiz) {
        return res
          .status(404)
          .json({ message: "Quiz not found or not owned by user" });
      }

      // Ambil peserta dan data user-nya
      const participants = await Participant.findAll({
        where: { quizId },
        include: {
          model: User,
          attributes: ["id", "name", "email"],
        },
        order: [
          ["score", "DESC"],
          ["joinTime", "ASC"],
        ],
      });

      // Format response
      const leaderboard = participants.map((p, idx) => ({
        rank: idx + 1,
        userId: p.User.id,
        name: p.User.name,
        email: p.User.email,
        score: p.score,
        joinTime: p.joinTime,
      }));

      res.status(200).json({ leaderboard });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = teacherController;

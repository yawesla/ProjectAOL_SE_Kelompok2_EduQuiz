const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");
const teacherController = require("../controllers/teacherController");
const studentController = require("../controllers/studentController");
const { AuthN } = require("../middlewares/auth");
const { errorHandle } = require("../middlewares/errorHandling");


router.post("/register", Controller.register);
router.post("/login", Controller.login);

router.use(AuthN)
router.post('/student/quiz',studentController.joinQuiz)
router.get('/student/quiz/:quizId/',studentController.getTotalQuestions);
router.get('/student/quiz/:quizId/questions/:number',studentController.getQuestion)
router.post('/student/quiz/:quizId/questions/:questionId',studentController.answerQuestions)
router.get('/student/quiz/:quizId/questions/:questionId/result',studentController.answerResult)
router.get('/student/quiz/:quizId/result',studentController.viewResult)

router.get('/teacher/quizzes',teacherController.viewAllQuiz)
router.post('/teacher/quizzes/new',teacherController.createQuiz)
router.post('/teacher/quizzes/:quizId',teacherController.addQuestions)
router.get('/teacher/quizzes/:quizId',teacherController.quizDetail)
router.delete('/teacher/quizzes/:quizId',teacherController.deleteQuiz)
router.delete('/teacher/quizzes/:quizId/questions/:questionId',teacherController.deleteQuestions)
router.get('/teacher/quizzes/:quizId/leaderboard',teacherController.viewLeaderboard)


router.use(errorHandle);

module.exports = router;

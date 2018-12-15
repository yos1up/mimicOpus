const express = require('express');

const uploadQuestion = require('./uploadQuestion');
const deleteQuestion = require('./deleteQuestion');
const loadQuestionsList = require('./loadQuestionsList');
const countQuestions = require('./countQuestions');
const changeDisplayName = require('./changeDisplayName');
const submitAnswer = require('./submitAnswer');
const getRanking = require('./getRanking');
const getMe = require('./getMe');
const loadBestSubmission = require('./loadBestSubmission');


const apiRouter = express.Router();

apiRouter.post('/api/uploadQuestion', uploadQuestion);
apiRouter.get('/api/loadQuestionsList', loadQuestionsList);
apiRouter.get('/api/countQuestions', countQuestions);
apiRouter.post('/api/deleteQuestion', deleteQuestion);
apiRouter.post('/api/submitAnswer', submitAnswer);
apiRouter.post('/api/changeDisplayName', changeDisplayName);
apiRouter.get('/api/getRanking', getRanking);
apiRouter.get('/api/getMe', getMe);
apiRouter.get('/api/loadBestSubmission', loadBestSubmission);

module.exports = apiRouter;

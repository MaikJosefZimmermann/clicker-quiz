'use strict';
var express = require('express'),
    app = express(),
    router = express.Router(),
    Questions = require('../models/questions');


router.use(function (req, res, next) {
    console.log('Incoming API request.', req.body);
    next();
});

router.route('/')


    .post(function (req, res) {
        var questions = new Questions();

        questions.question = req.body.question;
        questions.answer1 = req.body.answer1;
        questions.answer2 = req.body.answer2;
        questions.answer3 = req.body.answer3;
        questions.answer4 = req.body.answer4;
        questions.points = req.body.points;


        quiz.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'User created!'});
        });

        quiz.save(function (err) {
            console.log('button gehtt');
        });
    })


    .get(function (req, res) {
        Questions.find(function (err, questions) {
            if (err) {
                res.send(err);
            }
            res.json(questions);
        });
    });

router.route('/:quizId')


    .get(function (req, res) {
        Quiz.findById(req.params.quizId, function (err, quiz) {

            if (err) {
                res.send(err);
            }

            res.json(quiz);
        });
    })


    .put(function (req, res) {
        Quiz.findById(req.params.quizId, function (err, quiz) {

            if (err) {
                res.send(err);
            }


            quiz.qname = req.body.qname;
            quiz.question = req.body.question;
            quiz.answer1 = req.body.answer1;
            quiz.answer2 = req.body.answer2;
            quiz.answer3 = req.body.answer3;
            quiz.answer4 = req.body.answer4;

            quiz.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({message: 'Quiz updated!'});
            });

        });
    })


    .delete(function (req, res) {
        Quiz.remove({
            _id: req.params.quizId
        }, function (err, quiz) {

            if (err) {
                res.send(err);
            }

            res.json({message: 'Successfully deleed'});
        });


    });

module.exports = router;
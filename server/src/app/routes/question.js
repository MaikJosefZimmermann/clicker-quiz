'use strict';
var express = require('express'),
    app = express(),
    router = express.Router(),
    Question = require('../models/question');


router.use(function (req, res, next) {
    console.log('Incoming API request.', req.body);
    next();
});

router.route('/')


    .post(function (req, res) {
        var question = new Question();

        question.question = req.body.question;
        question.answer1 = req.body.answer1;
        question.answer2 = req.body.answer2;
        question.answer3 = req.body.answer3;
        question.answer4 = req.body.answer4;
        question.points = req.body.points;
        question.time = req.body.time;
        question.tags = req.body.tags;


        if (question.time) {

        } else {
            question.time = 0;
        }
        if (question.points) {

        } else {
            question.points = 1;
        }


        question.save(function (err) {

            if (err) {
                res.send(err);
            }
            res.json({message: 'User created!'});
        });

        question.save(function (err) {
            console.log('button gehtt');
        });
    })


    .get(function (req, res) {
        Question.find(function (err, question) {
            if (err) {
                res.send(err);
            }
            res.json(question);
        });
    });

router.route('/:questionId')


    .get(function (req, res) {
        Question.findById(req.params.questionId, function (err, question) {

            if (err) {
                res.send(err);
            }

            res.json(question);
        });
    })


    .put(function (req, res) {
        Question.findById(req.params.questionId, function (err, question) {

            if (err) {
                res.send(err);
            }


            question.question = req.body.question;
            question.answer1 = req.body.answer1;
            question.answer2 = req.body.answer2;
            question.answer3 = req.body.answer3;
            question.answer4 = req.body.answer4;
            question.points = req.body.points;
            question.time = req.body.time;
            question.subject = req.body.subject;

            question.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({message: 'Question updated!'});
            });

        });
    })


    .delete(function (req, res) {
        Question.remove({
            _id: req.params.questionId
        }, function (err, question) {

            if (err) {
                res.send(err);
            }

            res.json({message: 'Successfully deleted'});
        });


    });

module.exports = router;
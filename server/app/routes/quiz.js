'use strict';
var express = require('express'),
    app = express(),
    router = express.Router(),
    Quiz = require('../models/quiz');


router.use(function (req, res, next) {
    console.log('Incoming API request.', req.body);
    next();
});

router.route('/')


    .post(function (req, res) {
        var quiz = new Quiz();
        quiz.qname = req.body.qname;
        quiz.question = req.body.question;
        quiz.answer1 = req.body.answer1;
        quiz.answer2 = req.body.answer2;
        quiz.answer3 = req.body.answer3;
        quiz.answer4 = req.body.answer4;


        quiz.save(function (err) {
            if (err){
                res.send(err);}
            res.json({message: 'User created!'});
        });

        quiz.save(function (err) {
            console.log('button gehtt');
        });
    })


    .get(function (req, res) {
        Quiz.find(function (err, quizes) {
            if (err) {
                res.send(err);
            }
            res.json(quizes);
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
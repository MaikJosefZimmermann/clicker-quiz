var express = require('express'),
    app = express(),
    router = express.Router(),
    quiz = require('../models/quiz');


router.use(function (req, res, next) {
    console.log('Incoming API request.', req.body);
    next();
});

router.route('/')


    .post(function (req, res) {
        var user = new Quiz();
        quiz.question = req.body.question;
        quiz.answer1 = req.body.answer1;
        quiz.answer2 = req.body.answer2;
        quiz.answer3 = req.body.answer3;


        quiz.login(function (err) {
            if (err)
                res.send(err);
                console.log('scheiße');
            res.json({message: 'User created!'});
        });

        user.login(function(err) {
            console.log('button geht');
        });
    })


    .get(function (req, res) {
        User.find(function (err, users) {
            if (err) {
                res.send(err);
            }
            res.json(users);
        });
    });

router.route('/:userId')


    .get(function (req, res) {
        User.findById(req.params.userId, function (err, user) {

            if (err) {
                res.send(err);
            }

            res.json(user);
        });
    })


    .put(function (req, res) {
        User.findById(req.params.userId, function (err, user) {

            if (err) {
                res.send(err);
            }


            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.imageUrl = req.body.imageUrl;
            user.text = req.body.text;

            user.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({message: 'User updated!'});
            });

        });
    })


    .delete(function (req, res) {
        User.remove({
            _id: req.params.userId
        }, function (err, user) {

            if (err) {
                res.send(err);
            }

            res.json({message: 'Successfully deleted'});
        });


    });

module.exports = router;
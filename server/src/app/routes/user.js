'use strict';

var express = require('express'),
    app = express(),
    router = express.Router(),
    User = require('../models/user');


router.use(function (req, res, next) {
    console.log('Incoming API request.', req.body);
    next();
});

router.route('/')


    .post(function (req, res) {
        var user = new User();

        user.username = req.body.username;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.role = req.body.role;
        user.password = req.body.password;

        user.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'User updated!'});
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

            user.username = req.body.username;
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.role = req.body.role;
            user.password = req.body.password;


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
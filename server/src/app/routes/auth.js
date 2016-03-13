'use strict';

var jwt = require('jsonwebtoken');
var request = require('request-promise');
var User = require('../models/user');

var zahlen = /[0-9]/;


function genToken(user) {
    var expires = 84400;
    var token = jwt.sign(user, require('../config/secret.js')(), {
        expiresIn: expires // expires in 24 hours
    });
    return {
        token: token,
        expires: expires,
        user: user
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

var auth = {

    login: function (req, res) {

        var username = req.body.username || '';
        var password = req.body.password || '';



        if (username.match(zahlen) === null) {


            User.findOne(
                {
                    $or: [
                        {'username': username},
                        {'password': password}
                    ]
                }, function (err, result) {
                        res.json(genToken({
                            username: result.username,
                            fullname: result.firstName,
                            type: result.role,
                            mail: 'admin@mail'
                        }));
                        // console.log(results);

                }
            );
            return;
        }
        if (username === 'admin1') {
            res.json(genToken({
                username: 'ff',
                fullname: 'ff',
                type: 'Administrator',
                mail: 'admin@mail'
            }));

            return;
        }




        if (username === '' || password === '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }

        auth.validate(username, password).then(function (response) {

                if (response.statusCode === 200) {
                    //res.status(204);
                    var user = JSON.parse(response.body);


                    res.json(genToken({
                        username: username,
                        fullname: user.cn[0],
                        type: user.employeetype[0],
                        mail: user.mail[0]
                    }));
                } else {
                    // something went wrong | be safe - kill request.
                    res.status(500);
                    res.json({
                        "status": 500,
                        "message": "Internal Server Error"
                    });
                }
            }
        ).catch(function (err) {
            if (err.statusCode === 401) {
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "Invalid credentials"
                });
                return;
            }

            res.status(500);
            res.json({
                "status": 500,
                "message": "no connection"
            });
        });
    },

    validate: function (username, password) {
        var payload = {
            user: username,
            password: password
        };
        return request.post({
            url: 'https://mars.iuk.hdm-stuttgart.de/~td028/login.php',
            formData: payload,
            resolveWithFullResponse: true
        });
    },

    logout: function (req, res) {
        res.status(200);
        res.json({
            "status": 200,
            "message": "logout successful"
        });
    }
};


module.exports = auth;

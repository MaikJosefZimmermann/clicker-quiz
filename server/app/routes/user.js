/**
 * Created by maikzimmermann on 03.11.15.
 */
var express = require ('express');
var app = express();
var router = express.Router();
var User = require('../models/User');

router.use(function(req, res, next){
    console.log('Incoming API Request')
    next();
});

router.route('/')
    .post(function(req, res){
        var user = new User();

        user.lastName = req.body.lastName;
        user.firstName = req.body.firstName;
        user.imgUrl= req.body.imgUrl;



        user.save(function(err){
            if(err){
                res.send(err);
            }else {
                res.json({
                    message: 'User created'
                })
            }
        })
    })
    .get(function(req, res){
        User.find(function(err, users){
            if(err){
                res.send(err);
            }else{
                res.json(users);
            }
        });
    });

module.exports = router;
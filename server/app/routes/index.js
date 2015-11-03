/**
 * Created by maikzimmermann on 03.11.15.
 */
var express = require('express');
var app = express();
var router = express.Router();

router.get('/', function (req, res){
    res.json({
        message: 'welcome to our API'
    });
});

module.exports = router;
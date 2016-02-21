'use strict';

var jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
//TODO token leer
    var token = req.headers['x-access-token'];

    if (token) { //überprüfen ob er da ist
        jwt.verify(token, require('../config/secret.js')(), function (err, decoded) {
            /*verifeziert den token*/
            if (err) {
                res.status(401);
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else { //wenn kein error = token decodieren
                req.decoded = decoded; //decodierten daten im request
                /*in token nutzerrolle vermerken*/
                next(); //validierung des token war erfolgreich
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
};


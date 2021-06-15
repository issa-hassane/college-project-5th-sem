const express = require('express');
const Food = require('../models/food');

const router = express.Router();

router.get('/', isLoggedIn, (req, res) =>{
    Food.find((err,doc)=>{
        res.render('home', {title: 'User', food: doc});
    })
    

});

//---------------///
function isLoggedIn(req, res, next) { 
	if (req.isAuthenticated()) return next(); 
	res.redirect('/login'); 
}
//--------------//
module.exports = router;
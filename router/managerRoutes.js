const express = require('express');
const mongoose = require('mongoose');
const Food = require('../models/food');
const Order = mongoose.model('Order');
const Served = require('../models/served');

const router = express.Router();

router.get('/', isLoggedIn, isManager,(req, res) =>{
    // Food.find((err,doc)=>{
    //     res.render('home', {title: 'User', food: doc});
    // });
    res.render('managerdash', {title: 'Manager'});
    

});
router.get('/orderList',isLoggedIn, isManager,(req,res)=>{
	let order = Order.find((err,doc)=>{
		console.log(doc);
		res.render('orderList', {title: 'Order List', orders: doc});
	});

});
router.get('/confirmation/:orderId',isLoggedIn, isManager, async (req,res) =>{
	var action = req.query.action;
	var orderId = req.params.orderId;	

	switch (action) {
		case 'confirm':
			mongoose.model('Order').findOne({ _id: orderId }, function(err, result) {
				console.log(result);
			
				let swap = new (mongoose.model('Served'))(result.toJSON()) //or result.toObject
				/* you could set a new id
				swap._id = mongoose.Types.ObjectId()
				swap.isNew = true
				*/
			
				result.remove();
				swap.save();
				

			
				// swap is now in a better place
			});
			
			break;
		case 'reject':
			mongoose.model('Order').findOne({ _id: orderId }, function(err, result) {
				console.log(result);
			
				
			
				result.remove();
				// swap.save();
				

			
				// swap is now in a better place
			});
			break;
	
		default:
			break;
	}

	res.redirect('back');
});
 
//---------------///
function isLoggedIn(req, res, next) { 
	if (req.isAuthenticated()) return next(); 
	res.redirect('/login'); 
}
//--------------//

function isManager(req, res, next) {
	if (req.user.manager_role == true) {
		return next();
	}
	res.send("<h1>you are not a manager</h1>");
}
module.exports = router;
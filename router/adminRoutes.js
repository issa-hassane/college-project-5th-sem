// const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const Food = require('../models/food');
const User = require('../models/user');
const Served = require('../models/served');
const multer  = require('multer');
const passport = require("passport");
const rTable = require('../models/rTable');


//image destination
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/images');
    },
    filename: (req, file, cb) => {
        // console.log(file);
        cb(null, Date.now() + file.originalname);
    }
});
//image filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

//Dashboard
router.get("/", isLoggedIn, isAdmin, async (req, res)=> { 
	// console.log(User.countDocuments({}));
	await User.countDocuments({}, function( err, Ucount){
		if (err){
			console.log(err)
		}else{
			console.log("Count :", Ucount)
		}
	})
	res.render('admin',{title: 'Admin' }); 
});

//FOOD
router.get("/food", isLoggedIn, isAdmin, (req, res)=> { 
	
	res.render('food',{title: 'Admin'}); 

});

router.get("/addFood",isLoggedIn, isAdmin, (req, res)=>{
	res.render('addFood',{title:'Admin', msg:''})

});

router.post("/addFood", isLoggedIn, isAdmin,  upload.single('img'), async (req, res)=>{

	if (req.file) {
		var dataRecords ={
			name: req.body.name,
			category: req.body.category,
			details: req.body.details,
			price: req.body.price,
			img: req.file.filename
		}
	} else {
		var dataRecords ={
			name: req.body.name,
			category: req.body.category,
			details: req.body.details,
			price: req.body.price,
		}	
	}


	let food = new Food(dataRecords);
	try {
		food =  await food.save();
		console.log(food);
		res.render('addFood', {title: "Add food",msg:'Food item added successfully !!'})
		
	} catch (error) {
		console.log(error);
		
	}
});

router.get("/foodList",isLoggedIn, isAdmin, (req, res)=>{
	Food.find((err,doc)=>{
		res.render('foodList',{title:'Admin', food: doc})

	});

});

router.get('/deleteFood/:id',isLoggedIn, isAdmin, (req, res)=>{
	const foodId = req.params.id;
	// console.log(foodId);
	Food.findByIdAndDelete(foodId).then(result=>{
	res.redirect('/admin/foodList')
	}).catch(err=>{ console.log(err) })

});

router.get('/editFood/:id' ,isLoggedIn, isAdmin,(req, res)=>{
	Food.findById(req.params.id).then(result=>{
		res.render('editFood',{title:'Admin', food: result})
	}).catch(err=> console.log(err));
});

router.post('/updateFood/:id',upload.single('img'),isLoggedIn, isAdmin, (req, res)=>{

	if (req.file) {
		var dataRecords ={
			name: req.body.name,
			category: req.body.category,
			details: req.body.details,
			price: req.body.price,
			img: req.file.filename
		}
	} else {
		var dataRecords ={
			name: req.body.name,
			category: req.body.category,
			details: req.body.details,
			price: req.body.price,
		}	
	}
	const foodId = req.params.id;

	Food.findByIdAndUpdate(foodId, dataRecords).then(result=>{
		res.redirect('/admin/foodList')
	}).catch(err=>console.log(err));
});

router.post('/bookTable', async(req,res)=>{
	var dataRecords = {
		name :req.body.name,
		email : req.body.email,
		phoneno : req.body.phoneno,
		date : req.body.date,
		time : req.body.time,
		guest : req.body.guest
	}
	let rtable = new rTable(dataRecords);
	try {
		rtable =  await rtable.save();
		console.log(rtable);
		// res.render('addFood', {title: "Add food",msg:'Food item added successfully !!'})
		res.render('bookSuccess',{title: 'Table Reservation'});

		
	} catch (error) {
		console.log(error);
		
	}
	// res.send("Table booked successfully");
	

});

//MANAGER

router.get("/manager", isLoggedIn, isAdmin, (req, res)=> { 
	
	res.render('manager',{title: 'Admin'}); 

});

router.get("/addManager", isLoggedIn, isAdmin, (req, res)=> { 
	
	res.render('addManager',{title: 'Admin', msg:''}); 

});

router.get("/managerList", isLoggedIn, isAdmin, (req, res)=> { 

	User.find((err,doc)=>{
		res.render('managerList',{title:'Admin', managerL: doc})

	});
	
});

router.get('/deleteManager/:id',isLoggedIn, isAdmin, (req, res)=>{
	const managerId = req.params.id;
	User.findByIdAndDelete(managerId).then(result=>{
	res.redirect('/admin/managerList')
	}).catch(err=>{ console.log(err) })

});

router.post("/addManager", isLoggedIn, isAdmin,  upload.single('img'), async (req, res)=>{
	if (req.file) {

		var username = req.body.name;
		var phoneno = req.body.phoneno;
		var password1 = req.body.password1;
		var password2 = req.body.password2;
		var img = req.body.img;
		var email = req.body.email;
		// console.log("debugging--------------" + req.body.username);
		if (password1 === password2) {

			User.register(new User({
				username: username,
				phoneno: phoneno,
				manager_role: true,
				img: img,
				email: email
			}),
				password1, function (err, user) {
					if (err) {
						console.log(err);
						return res.render("registration", { msg: "registration fail !!", title: "registration" });
					}
				res.render("addManager", { msg: "registration successfull!!", title: "registration" });
			});
		}
		
	} else {
		var username = req.body.name;
		var phoneno = req.body.phoneno;
		var password1 = req.body.password1;
		var password2 = req.body.password2;
		var img = req.body.img;
		var email = req.body.email;
		// console.log("debugging--------------" + req.body.username);
		if (password1 === password2) {

			User.register(new User({
				username: username,
				phoneno: phoneno,
				manager_role: true,
				email: email
			}),
				password1, function (err, user) {
					if (err) {
						console.log(err);
						return res.render("registration", { msg: "registration fail !!", title: "registration" });
					}
				res.render("addManager", { msg: "registration successfull!!", title: "registration" });
			});
		}
		
	}

});

// table reservation
router.get("/inbox", isLoggedIn, isAdmin, (req, res)=> { 

	rTable.find((err,doc)=>{
		
		res.render('reservationT',{title: 'Reservation', reservation: doc}); 
	});
	

});
router.get("/deleteReser/:id", isLoggedIn, isAdmin, (req, res)=> { 

	const reserId = req.params.id;
	rTable.findByIdAndDelete(reserId).then(result=>{
	res.redirect('/admin/inbox');
	}).catch(err=>{ console.log(err) })
});





//---------------///
function isLoggedIn(req, res, next) { 
	if (req.isAuthenticated()) return next(); 
	res.redirect('/login'); 
}
//--------------//
function isAdmin(req, res, next) {
	if (req.user.admin_role == true) {
		return next();
	}
	res.send("<h1>you are not admin</h1>");
}
//------------///
module.exports = router;
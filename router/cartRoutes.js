const express = require('express');
const Food = require('../models/food');
const Cart = require('../models/cart');
// const Order = require('../models/order');
const mongoose = require('mongoose');

const router = express.Router();


router.get('/checkout', isLoggedIn, async(req, res) =>{

  const userId = req.user._id;
  let cart = await Cart.findOne({ userId });
  var totalPrice = 0;
  if (!cart) {
    console.log('from if');
    res.render('cart',{title: 'Cart', Cart: cart, totalPrice: totalPrice});
    
  }else{

    cart.products.forEach(item => {
      totalPrice += item.price;
      // console.log(totalPrice);
    });
    console.log(totalPrice);  
    res.render('cart',{title: 'Cart', Cart: cart, totalPrice: totalPrice});
  
  }
 
});

router.post('/update', async (req,res) =>{
  console.log('heloo');
    const userId = req.user._id;
    let foodId = req.body.foodId;
    let qty = req.body.qty;
    // console.log(qty);
    // console.log(foodId);
    // console.log(userId);
    let cart = await Cart.findOne({ userId });
    let itemIndex = cart.products.findIndex(p => p.productId == foodId);
    newPrice = cart.products[itemIndex]["price"] * qty;
    var update = {quantity: qty, price: newPrice };
    // console.log(cart.products[itemIndex].price);

    Cart.updateMany({'products.productId': foodId}, {'$set':  {'items.$': update}}, function(err) {
        console.log(err); 
    });
      
   // let cart = await Cart.findOne({ userId });
    let cartLength = cart.products.length;
    // console.log(cartLength);
    res.json({cartLength: cartLength, result: 'success'});

});

router.get('/update/:productId', async(req,res)=>{
  var productId = req.params.productId;
  var action = req.query.action;
  var userId = req.user._id;
  
  let cart = await Cart.findOne({ userId });

  cart.products.forEach((item,index) => {
    console.log("Item:"+ item);
    console.log("index:"+ item.productId);
    if(item.productId == productId){
      switch (action) {
        case 'add':
          console.log("add");
          item.quantity = ++item.quantity;
          item.price = item.unitPrice * item.quantity;
          cart.products[index] = item;  
          break;
          case 'remove':
            console.log("remove");
            item.quantity = --item.quantity;
            if (item.quantity == 0) {
              cart.products.splice(index ,1);
              console.log('hello from if index:'+ index);
              break;
            }else{
              item.price = item.unitPrice * item.quantity;
              cart.products[index] = item;
              break;
            }
          case 'remove1':
            cart.products.splice(index ,1);
            break;
      
        default: console.log("switch default");
          break;
      }
    }
    
    // console.log(totalPrice);
  });
  cart = await cart.save();
  res.redirect('back');

});

router.get('/order', async(req,res)=>{
  var userId = req.user._id;
  var userName = req.user.username;

  mongoose.model('Cart').findOne({ userId: userId }, function(err, result) {
    console.log(result);

    let swap = new (mongoose.model('Order'))(result.toJSON()) //or result.toObject
    /* you could set a new id
    swap._id = mongoose.Types.ObjectId()
    swap.isNew = true
    */

    result.remove()
    swap.save()

    // swap is now in a better place

})
res.render('success', {title: "Success"});

});

router.get("/add/:id", async (req, res) => {
    // const { productId, quantity, name, price } = req.body;
    const userId = req.user._id;
    const userName = req.user.username;
    const foodId = req.params.id;
    Food.findOne({_id: foodId}, async (err,f)=>{
        if (err) {
            console.log(err);
        }
        var productId = f._id;
        var name = f.name;
        var details = f.details;
        var img = f.img;
        var price = f.price;
        var unitPrice = f.price;
        var quantity = 1;
        try {
            let cart = await Cart.findOne({ userId });
        
            if (cart) {
              //cart exists for user
              let itemIndex = cart.products.findIndex(p => p.productId == productId);
        
              if (itemIndex > -1) {
                //product exists in the cart, update the quantity
                let productItem = cart.products[itemIndex];
                productItem.quantity = ++productItem.quantity;
                productItem.price = (price * productItem.quantity);
                cart.products[itemIndex] = productItem;
              } else {
                //product does not exists in cart, add new item
                cart.products.push({ productId, quantity, name, details, img, price, unitPrice });
              }
              cart = await cart.save();
              //return res.status(201).send(cart);
              res.redirect('http://localhost:3000/user#ourMenu');
            } else {
              //no cart for user, create new cart
              const newCart = await Cart.create({
                userId,
                userName,
                products: [{ productId, quantity, name, details, img, price, unitPrice }]
              });
        
              //return res.status(201).send(newCart);
              res.redirect('http://localhost:3000/user#ourMenu');
            }
          } catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong");
          }

    });
  
    
  });
  


//---------------///
function isLoggedIn(req, res, next) { 
	if (req.isAuthenticated()) return next(); 
	res.redirect('/login'); 
}
//--------------//
module.exports = router;
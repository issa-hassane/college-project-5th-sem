var mongoose = require("mongoose");
var passportlocalmongoose = require("passport-local-mongoose");
var UserSchema = mongoose.Schema({
username: {
    type:String,
    required: true, 
},
phoneno: {
    type: String,
    required: true
},
password: {
    type: String,
},
email: {
    type: String,
    required: true
},
admin_role: {
    type: Boolean,
    default:false,
    required: true
},
manager_role: {
    type: Boolean,
    default:false,
    required: true
},
img: {
    type: String,
    default: 'default.png'
},
date: {
    type: Date,
    default: new Date
}
});

UserSchema.plugin(passportlocalmongoose);
module.exports = mongoose.model("User", UserSchema);
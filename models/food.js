const momgoose = require('mongoose');

var foodSchema = momgoose.Schema({
    name: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    
    price: {
        type: Number,
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

module.exports = momgoose.model("Food", foodSchema);
const momgoose = require('mongoose');

var rTableSchema = momgoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneno: {
        type: String,
        required: true
    },
    
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    dateCreation: {
        type: Date,
        default: new Date
    }
});

module.exports = momgoose.model("rTable", rTableSchema);
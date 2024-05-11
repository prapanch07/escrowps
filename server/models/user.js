const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username : {
        type : String, required : true
    },
    email : {
        type: String, required:true
    },
    password:{
        type:String, required:true
    },
    fullname:{
        type: String, required:true
    },
    subscriber:{
        type: Boolean, default: false
    },
    isAdmin: {
        type: Boolean,
        default: false 
    },
    isSeller: {
        type: Boolean,
        default: false 
    
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema)
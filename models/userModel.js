const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    mail: String,
    name: String,
    surname: String,
    login: String,
    pwd: String,
    dob: Date,
    phone: String, 
});

// DB method converts original pwd to reversed pwd
UserSchema.methods.reversePwd = function(){
    let splitString = this.pwd.split("");
    let reverseArray = splitString.reverse();
    let joinArray = reverseArray.join("");
    return joinArray;
};
// DB method compares entered pwd with existing user`s pwd
UserSchema.methods.comparePwd = function(user){
    if(user.pwd.split("").reverse().join("") === this.pwd) {
        console.log('pwd is allright!');
        return true;
    }
    else {
        console.log('pwd is fucked up!');
        return false;
    }
};


const Model = mongoose.model('User', UserSchema);
module.exports = Model;
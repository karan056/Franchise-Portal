var mongoose = require("mongoose");

function getLoginModel() {
    var userSchema = mongoose.Schema;

    var userColSchema = new userSchema({
        useremail: { type: String, required: true, index: true, unique: true },
        pwd: String,
        usertype: String,
        date: { type: Date, default: Date.now }
    }, { versionKey: false }); // To avoid the __v field in MongoDB

    // Check if model already exists before defining it
    return mongoose.models.loginCredentials || mongoose.model("loginCredentials", userColSchema);
}

module.exports = { getLoginModel };
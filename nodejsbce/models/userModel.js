var mongoose = require("mongoose");

function getUserModel() {
    var userSchema = mongoose.Schema;

    var userColSchema = new userSchema({
        mname: String,
        email: { type: String, required: true, index: true, unique: true },
        mb: String,
        addr: String,
        bname: String,
        site: String,
        area: String,
        floor: String,
        city: String,
        state: String,
        pincode: String,
        ownstatus: String,
        status: { type: Number, default: 0 },
        date: { type: Date, default: Date.now }
    }, { versionKey: false }); // To avoid the __v field in MongoDB

    // Check if model already exists before defining it
    return mongoose.models.userCollection || mongoose.model("userCollection", userColSchema);
}

module.exports = { getUserModel };
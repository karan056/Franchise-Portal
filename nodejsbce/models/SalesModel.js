var mongoose = require("mongoose");

function getSalesModel() {
    var userSchema = mongoose.Schema;

    var userColSchema = new userSchema({
        useremail: { type: String, required: true },
        date: { type: Date, required: true },
        customers: { type: Number, required: true },
        todaySale: { type: Number, required: true },
    }, { versionKey: false }); // To avoid the __v field in MongoDB

    // Check if model already exists before defining it
    return mongoose.models.Sales || mongoose.model("Sales", userColSchema);
}

module.exports = { getSalesModel };
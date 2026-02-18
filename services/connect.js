const mongoose = require("mongoose")
let connecturl =process.env.MONGODB_URI || "mongodb://localhost:27017/NEW-PYQ-HUB"
async function connecttoserver() {
    return await mongoose.connect(connecturl).then(() => console.log("mongodb connected")).catch((err) => console.log(err))
}
module.exports = { connecttoserver };
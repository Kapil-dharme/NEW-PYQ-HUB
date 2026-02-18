const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    count: { type: Number, default: 0 }
});

module.exports = mongoose.model('Visit', visitSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

var Subscriptions = mongoose.model('Subscription', subSchema);
module.exports = Subscriptions;
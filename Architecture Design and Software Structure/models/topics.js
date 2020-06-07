const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
    topics: {
        type: String,
        required: true
    }
});

var Topics = mongoose.model('Topic', topicSchema);
module.exports = Topics;
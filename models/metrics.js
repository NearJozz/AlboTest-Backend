const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const metricsSchema = new mongoose.Schema({
    UUID: { type: String, default: uuidv4,unique: true },
    method: {type: String, required: true },
    action: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required : true },
    latency: {type: Number, required :true}
});

const Metrics = mongoose.model('Metric', metricsSchema);

module.exports = Metrics;

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const taskSchema = new mongoose.Schema({
    UUID: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    responsible: { type: String, required: true },
    done: { type: Boolean, default: false }
},{ timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

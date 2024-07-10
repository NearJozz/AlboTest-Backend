const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const Metrics = require('../models/metrics')

// Middleware before any route
router.use((req, res, next) => {
    /* this function is executed for any route to measure the response times */
    let Input=new Date()
     const Metric = new Metrics({
        method: req.method,
        action: req.originalUrl,
        startDate:Input.toISOString(),
        endDate:null,
        latency:null
    })
    res.Metric=Metric; 
    next();
});

// Get All Tasks
router.get('/', async (req, res,next) => {
    try {
        let ref = new Date()
        const tasks = await Task.find();
        await saveMetric(res)
        res.json(tasks);
    } catch (err) {
        await saveMetric(res)
        res.status(500).json({ message: err.message });
    }
});

// Get Task by ID (UUID)
router.get('/:UUID', getTask, async(req, res) => {
    await saveMetric(res)
    res.json(res.task);
});

// Create new Task
router.post('/', async (req, res) => {
    const task = new Task({
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        responsible: req.body.responsible,
        done: req.body.done
    });
    try {
        const newTask = await task.save();
        await saveMetric(res)
        res.status(201).json(newTask);
    } catch (err) {
        await saveMetric(res)
        res.status(400).json({ message: err.message });
    }
});

// Update Task by  ID (UUID)
router.put('/:UUID', getTask, async (req, res) => {
    const { error } = Task.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    res.task.name = req.body.name;
    res.task.description = req.body.description;
    res.task.startDate = req.body.startDate;
    res.task.endDate = req.body.endDate;
    res.task.responsible = req.body.responsible;
    res.task.done = req.body.done;

    try {
        const updatedTask = await res.task.save();
        await saveMetric(res)
        res.json(updatedTask);
    } catch (err) {
        await saveMetric(res)
        res.status(400).json({ message: err.message });

    }
});

// Update Task by ID (UUID)
router.patch('/:UUID', getTask, async (req, res) => {
    /* Validate the body input this could be replace with libs like joi */
    if (req.body.name != null) {
        res.task.name = req.body.name;
    }
    if (req.body.description != null) {
        res.task.description = req.body.description;
    }
    if (req.body.startDate != null) {
        res.task.startDate = req.body.startDate;
    }
    if (req.body.endDate != null) {
        res.task.endDate = req.body.endDate;
    }
    if (req.body.responsible != null) {
        res.task.responsible = req.body.responsible;
    }
    if (req.body.done != null) {
        res.task.done = req.body.done;
    }
    try {
        const updatedTask = await res.task.save();
        await saveMetric(res)
        res.json(updatedTask);
    } catch (err) {
        await saveMetric(res)
        res.status(400).json({ message: err.message });
    }
});

// Delete task by  ID (UUID)
router.delete('/:UUID', getTask, async (req, res) => {
    try {
        await Task.deleteOne({ UUID: req.params.UUID });
        await saveMetric(res)
        res.status(204).send();

    } catch (err) {
        await saveMetric(res)
        res.status(500).json({ message: err.message });

    }
});

/* this function is executed for get a Task by UUID like a middleware */
async function getTask(req, res, next) {
    let task;
    try {
        task = await Task.findOne({ UUID: req.params.UUID });
        if (task == null) {
            return res.status(404).json({ message: 'Cannot find task' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.task = task;
    next();
}

/* this function saves the results of the  operation measure */
async function saveMetric(res){
    try{
        let ref= new Date()
        res.Metric.endDate = ref
        res.Metric.latency = ref.getTime() - res.Metric.startDate;
        await res.Metric.save()
    }catch(err){
        console.log("Error handling Metrics",err)
    }
}


module.exports = router;

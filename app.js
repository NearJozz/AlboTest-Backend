// Dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const tasksRouter = require('./routes/routerTasks');
const cors = require('cors')
const app = express();
// Middleware
    app.use(bodyParser.json());
    app.use(cors())
// MongoDB Conection
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));
// Routes
    app.use('/tasks', tasksRouter);


//server listen
const PORT = process.env.PORT || 3000;
const server=app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// export for use in test like JEST
module.exports={app,server};

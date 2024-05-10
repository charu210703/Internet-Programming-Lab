const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 5000;
// Connection URI
const uri = "mongodb://localhost:27017";
const dbName = "ipLab";
// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
// Connect to MongoDB
async function connect() {
try {
// Create a new MongoClient instance
const client = new MongoClient(uri);
// Connect to MongoDB
await client.connect();
console.log("Connected to MongoDB server");
// Access the database
const db = client.db(dbName);
// Define collection
const tasksCollection = db.collection("tasks");

// Fetch tasks endpoint
app.get('/fetch', async (req, res) => {
    try {
        // Retrieve tasks from the tasks collection
        const tasks = await tasksCollection.find({}).toArray();
        // Send the tasks as a JSON response
        res.json(tasks);
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});
app.post('/add', async (req, res) => {
    try {
        const task = req.body;
        // Retrieve tasks from the tasks collection
        const mes = await tasksCollection.insertOne(task);
        // Send the tasks as a JSON response
        res.json(mes);
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});
app.post('/delete', async (req, res) => {
    try {
        const task = req.body;
        console.log(task);
        // Retrieve tasks from the tasks collection
        const mes = await tasksCollection.deleteOne({id:task.taskId});
        // Send the tasks as a JSON response
        res.json(mes);
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});
app.post('/deleteall', async (req, res) => {
    try {
        // Retrieve tasks from the tasks collection
        const mes = await tasksCollection.deleteMany({});
        // Send the tasks as a JSON response
        res.json(mes);
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});
app.post('/deletedone', async (req, res) => {
    try {
        // Retrieve tasks from the tasks collection
        const mes = await tasksCollection.deleteMany({isDone:true});
        // Send the tasks as a JSON response
        res.json(mes);
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});
app.post('/update', async (req, res) => {
    try {
        const taskId = req.body.taskId;
        const newTask = req.body.newTask;

        // Remove the _id field from the newTask object
        delete newTask._id;

        // Update the task in the tasks collection
        const result = await tasksCollection.updateOne({ id: taskId }, { $set: newTask });

        // Send the result of the update operation as a JSON response
        res.json(result);
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});
// Start server
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});
} catch (err) {
console.error("Error connecting to MongoDB:", err);
}
}
// Call the connect function
connect();
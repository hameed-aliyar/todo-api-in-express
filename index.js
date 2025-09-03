const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const addRequestTime = require('./middleware/addRequestTime.js')

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(addRequestTime);

let todos;
try {
    const data = fs.readFileSync('./database.json', 'utf8');
    todos = JSON.parse(data);
    console.log('Database loaded successfully.');
} catch (error) {
    console.log('Error loading database: ', error);
    todos = [];
}

let nextId;
if (todos.length > 0) {
    nextId = Math.max(...todos.map(t => t.id)) + 1;
} else {
    nextId = 1;
}

async function saveDataToFile() {
    try {
        const data = JSON.stringify(todos, null, 2);
        await fs.promises.writeFile('./database.json', data, 'utf8');
    } catch (error) {
        console.error("Error writing to database file:", error);
    }
}

const dbDependencies = {
    todos,
    nextId,
    saveDataToFile
};

const createTodoRouter = require('./routes/todos.js');
const todoRoutes = createTodoRouter(dbDependencies);

app.use('/todos', todoRoutes);

app.get('/', (req, res) => {
    console.log('The request time is : ', req.requestTime);
    let responseText = 'Welcome to the Express API!';
    responseText += `\nRequested at : ${req.requestTime}`;
    res.send(responseText);
});

app.listen(PORT, () => {
    console.log(`Server running on http:/localhost:${PORT}`);
}); 


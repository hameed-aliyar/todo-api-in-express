const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());

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

app.get('/', (req, res) => {
    res.send('Hello Express!');
});

app.get('/todos', (req, res) => {
    res.json(todos);
});

app.post('/todos', async (req, res) => {
    const newTodoData = req.body;
    if(!newTodoData.text || typeof newTodoData.text !== 'string' || newTodoData.text.trim() === '') {
        return res.status(400).json({ message: 'Validation Error: The "Text" field is required.' });
    }
    const newTodo = {
        id: nextId++,
        text: newTodoData.text.trim(),
        completed: newTodoData.completed === true
    };
    todos.push(newTodo);
    await saveDataToFile();
    res.status(201).json(newTodo);
});

app.put('/todos/:id', async (req, res) => {
    const idToUpdate = parseInt(req.params.id);
    const newData = req.body;
    const indexToUpdate = todos.findIndex(todo => todo.id === idToUpdate);
    if(indexToUpdate === -1) {
        return res.status(404).json({ message: 'Todo is not found' });
    }
    if (
        (newData.text !== undefined && (typeof newData.text !== 'string' || newData.text.trim() === '')) ||
        (newData.completed !== undefined && typeof newData.completed !== 'boolean')
    ) {
        return res.status(400).json({ message: 'Validation Error: Invalid data provided.' });
    }
    const updatedTodo = { ...todos[indexToUpdate], ...newData };
    todos[indexToUpdate] = updatedTodo;
    await saveDataToFile();
    res.json(updatedTodo)
})

app.delete('/todos/:id', async (req, res) => {
    const idToDelete = parseInt(req.params.id);
    const indexToRemove = todos.findIndex(todo => todo.id === idToDelete);
    if (indexToRemove === -1) {
        return res.status(404).json({ message: 'Todo not found' });
    }
    todos.splice(indexToRemove, 1);
    await saveDataToFile();
    res.sendStatus(204);
})

app.listen(PORT, () => {
    console.log(`Server running on http:/localhost:${PORT}`);
});
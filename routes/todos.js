const express = require('express');

function createTodoRouter(dependencies) {
    const router = express.Router();

    let { todos, nextId, saveDataToFile } = dependencies;
    router.get('/', (req, res) => {
        res.json(todos);
    });
    
    router.post('/', async (req, res) => {
        const newTodoData = req.body;
        if (!newTodoData.text || typeof newTodoData.text !== 'string' || newTodoData.text.trim() === '') {
            return res.status(400).json({ message: 'Validation Error: the "text" field is required and should be a string.' })
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
    
    router.put('/:id', async (req, res) => {
        const idToUpdate = parseInt(req.params.id);
        const newData = req.body;
        const indexToUpdate = todos.findIndex(todo => todo.id === idToUpdate);
        if (indexToUpdate === -1) {
            return res.status(404).json({ message: 'Todo not found.' })
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
        res.json(updatedTodo);
    });
    
    router.delete('/:id', async (req, res) => {
        const idToDelete = parseInt(req.params.id);
        const indexToRemove = todos.findIndex(todo => todo.id === idToDelete);
        if (indexToRemove === -1) {
            return res.status(404).json({ message: "Todo not found." });
        }
        todos.splice(indexToRemove, 1);
        await saveDataToFile();
        res.sendStatus(204);

    });
    
    return router;    
}

module.exports = createTodoRouter;
let { todos, nextId, saveDataToFile } = require('../models/db.js');

const getTodos = (req, res) => {
    res.json(todos);
};

const createTodo = async (req, res) => {
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
};

const updateTodo = async (req, res) => {
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
};

const deleteTodo = async (req, res) => {
    const idToDelete = parseInt(req.params.id);
    const indexToRemove = todos.findIndex(todo => todo.id === idToDelete);
    if (indexToRemove === -1) {
        return res.status(404).json({ message: "Todo not found." });
    }
    todos.splice(indexToRemove, 1);
    await saveDataToFile();
    res.sendStatus(204);
};

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
}
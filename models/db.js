const fs = require('fs');

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


module.exports = { todos, nextId, saveDataToFile };
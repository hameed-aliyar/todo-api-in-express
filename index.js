const express = require('express');
const morgan = require('morgan');
const addRequestTime = require('./middleware/addRequestTime.js');
const errorHandler = require('./middleware/errorMIddleware.js');
const todoRoutes = require('./routes/todos.js');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(addRequestTime);

app.use('/todos', todoRoutes);

app.get('/', (req, res) => {
    console.log('The request time is : ', req.requestTime);
    let responseText = 'Welcome to the Express API!';
    responseText += `\nRequested at : ${req.requestTime}`;
    res.send(responseText);
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http:/localhost:${PORT}`);
}); 


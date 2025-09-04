function errorHandler (err, req, res, next) {
    console.error('ERROR : ', err);
    if(res.headersSend) {
        return next(err);
    }
    res.status(500).json({ message: 'Internal Server Error.' });
}

module.exports = errorHandler;
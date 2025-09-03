function addRequestTime(req, res, next) {
    req.requestTime = new Date().toISOString();
    next();
}

module.exports = addRequestTime;
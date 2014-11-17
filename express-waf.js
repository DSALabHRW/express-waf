module.exports.check = function(req, res, cb) {
    console.log(req.url);
    if (cb) {
        cb();
    }
};
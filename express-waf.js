(function() {
    var modules = [];

    module.exports.addModule = function (moduleName, config, callback) {
        var firewallModule = require(moduleName);

        if (firewallModule.check && firewallModule.init) {
            firewallModule.init(config);
            modules.push(firewallModule);
        } else {
            callback(moduleName + ' does not define a check and an init function!');
        }
    };

    module.exports.check = function (req, res, cb) {
        for (var m in modules) {
            modules[m].check(req, res);
        }
        if (cb) {
            cb();
        }
    };
})();
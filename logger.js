(function() {

    var _logger;

    function Logger() {
        var log4js = require('log4js');
        _logger = log4js.getLogger();
    };

    Logger.prototype.log = function(attackType, host) {
        _logger.warn('Attack: ' + attackType + ' detected from host: ' + host);
    };

    module.exports = Logger;

})();
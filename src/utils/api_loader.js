const path = require('path');
const fs = require('fs');

module.exports = {
    load: function(app, workDir) {
        const apiPath = path.join(workDir, 'controllers')
        fs.readdirSync(apiPath).forEach(function(controller) {
            const fullControllerPath = `${apiPath}/${controller}`
            require(fullControllerPath)(app);
        });
    } 
}

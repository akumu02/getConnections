global.appRoot = require.main.path;
let pkg = require(global.appRoot + '/package.json');

try {
    // LOAD CONFIGURATION FILE
    global.config = require(global.appRoot + '/config/config.json')[pkg.name];

    // VALIDATE CONFIG VERSION
    if (pkg.version !=  global.config.version)
        throw new Error("Incorrect Config Version");

    // SET BASIC APPLICATION INFORMATION FROM PACKAGE
    global.config.name = pkg.name;
    global.config.version = pkg.version

    // VALIDATE ENVIRONMENT
    if (process.env.NODE_ENV == 'development' || typeof process.env.NODE_ENV == 'undefined') {
        // DEVELOPMENT VARIABLES
        global.config.instance =  global.config.name + "-01";
        global.config.port = 8000;
    }
    else {
        // PRODUCTION ENVIRONMENT VARIABLES
        if (typeof process.env.INSTANCE == 'undefined')
            throw new Error("Environment variable INSTANCE undefined");
       
        if (typeof process.env.PORT == 'undefined')
            throw new Error("Environment variable PORT undefined");

        global.config.instance = process.env.INSTANCE;
        global.config.port = process.env.PORT;
    }

    // SET GLOBAL LOGGER
    global.logger = require(global.appRoot + '/managers/logs/logger');
        
} catch (error) {
    console.log(`\n${pkg.name} ${pkg.version} - \x1b[31m *** CONFIGURATION ERROR: ${error.message} *** \x1b[0m- ${Date().toLocaleString()}\n`);
    process.exit();
}
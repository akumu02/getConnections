require('./managers/config/config.js');

const express = require('express'),
    { ErrorControl } = require(global.appRoot + '/managers/error/error'),
    uuid = require('uuid'),
    app = express();

app.use(express.json());
app.disable('x-powered-by');

app.get('/', (req, res) => {
    var info = {
        service : global.config.name,
        version : global.config.version,
        instance : global.config.instance,
        port: global.config.port,
        status : {
            code : 200,
            message : "Running"
        }
    }
    res.json(info);
});

app.use('/', require('./controllers/default.js'));

app.all('*', (req, res, next) => {
    req.transactionId = uuid.v4();
    global.logger.warn({ transactionId:  req.transactionId, message: "Invalid Route Request.", method: req.method, originalUrl: req.originalUrl });
    next(new ErrorControl(501, `Cannot ${req.method} on route ${req.originalUrl}`));
});

app.use(function (err, req, res, next) {
    let info = {
        service: global.config.name,
        version: global.config.version,
        instance: global.config.instance,
        transactionId : req.transactionId,
        status: {
            code: err.status,
            message: err.statusMessage
        },
        error: {
            message: err.message
        }
    }
    res.set({
        'x-service': global.config.name,
        'x-version': global.config.version,
        'x-instance': global.config.instance,
        'x-transactionId': req.transactionId
    });
    res.status(err.status).json(info);
});

app.listen(global.config.port, () => {
    global.logger.info(`${global.config.name} ${global.config.version} - Running on Internal Port ${global.config.port} - ${Date().toLocaleString()}`);
    console.log(`${global.config.name} ${global.config.version} - \x1b[32m RUNNING ON INTERNAL PORT ${global.config.port} \x1b[0m- ${Date().toLocaleString()}`);
});
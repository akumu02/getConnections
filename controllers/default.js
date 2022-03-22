const express = require("express"),
  { ErrorControl } = require(global.appRoot + "/managers/error/error"),
  uuid = require("uuid"),
  router = express.Router(),
  MongoClient = require("mongodb").MongoClient,
  { obtainConnections } = require(global.appRoot + "/helpers/mongodb"),
  config = require(global.appRoot + "/config/config.json"),
  DBs = config.DBs;
let customersInfo = [];

router.post("/getInfoToConnection", async (req, res, next) => {
  req.transactionId = uuid.v4();

  // SIMPLE LOG INFORMATION
  global.logger.info({
    transactionId: req.transactionId,
    message: "HTTP POST Request Received",
    originalUrl: req.originalUrl,
    requestBody: req.body,
  });

  try {
    // SIMPLE VALIDATION
    if (!req.body.serviceId) {
      // SIMPLE LOG WARNING
      global.logger.warn({
        transactionId: req.transactionId,
        message: "HTTP POST Request Whitout Payload",
        originalUrl: req.originalUrl,
        requestBody: req.body,
      });
      throw new ErrorControl(400, "Please provide serviceId");
    }
    const serviceId = req.body.serviceId;
    const customerId = req.body.customerId;
    const filter = customerId
      ? {
          "customerData.services.id": serviceId,
          "customerData.customerId": req.body.customerId,
        }
      : { "customerData.services.id": serviceId };

    customersInfo = await obtainConnections({
      url: DBs[0].url,
      base: DBs[0].base,
      serviceId,
      filter,
    });

    if (customersInfo.length === 0) {
      customersInfo = await obtainConnections({
        url: DBs[1].url,
        base: DBs[1].base,
        serviceId,
        filter,
      });
    }

    if (customersInfo.length === 0) {
      customersInfo = await obtainConnections({
        url: DBs[2].url,
        base: DBs[2].base,
        serviceId,
        filter,
      });
    }

    // SIMPLE OBJECT RESPONSE
    res.set({
      "x-service": global.config.name,
      "x-version": global.config.version,
      "x-instance": global.config.instance,
      "x-transactionId": req.transactionId,
    });
    res.status(200).json({
      message: "Request executed successfully!",
      code: 200,
      customersInfo,
    });
  } catch (error) {
    // SIMPLE LOG ERROR
    global.logger.error({
      transactionId: req.transactionId,
      message: error.message,
      originalUrl: req.originalUrl,
      requestBody: req.body,
    });
    return next(new ErrorControl(error.status, error.message));
  }
});

module.exports = router;

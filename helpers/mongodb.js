const MongoClient = require("mongodb").MongoClient,
  { ErrorControl } = require(global.appRoot + "/managers/error/error");
let docs = [],
  client;

async function obtainConnections(payload) {
  try {
    client = await MongoClient.connect(payload.url);
    let db = client.db(payload.base);
    const col = db.collection("customers");

    docs = await col.find(payload.filter).toArray();

    client.close();

    const result = docs.map((customer) => {
      return {
        //obtener toda la información según estructura en base mongo. 
        // EJ:
        customerId: customer.customerData.customerId,
        server: customer.customerData.serverName,
        base: customer.customerData.dataBase
      };
    });

    return result;
  } catch (error) {
    //client.close();
    global.logger.error({
      transactionId: req.transactionId,
      message: error.message,
      originalUrl: req.originalUrl,
      requestBody: req.body,
    });
    return next(new ErrorControl(error.status, error.message));
  }
}

module.exports.obtainConnections = obtainConnections;

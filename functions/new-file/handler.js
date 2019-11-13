"use strict";
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://func_mdb:27017/";

const connect = MongoClient.connect(url, { useUnifiedTopology: true });
const run = (conn, db, collection, foo, obj) =>
  conn
    .db(db)
    .collection(collection)
    [foo](obj);

const splitKey = key => ({
  bucket: key.split("/")[0],
  name: key.split("/")[1].split(".")[0],
  type: key.split("/")[1].split(".")[1]
});

module.exports = async (event, context) => {
  try {
    if (event.body.Key) {
      const record = event.body.Records.find(
        record => record.eventName === "s3:ObjectCreated:Put"
      );
      await run(await connect, "tp5", "file", "insertOne", {
        _id: event.body.Key,
        ...splitKey(event.body.Key),
        date: record.eventTime,
        size: record.s3.object.size
      });
      context.status(200).succeed("OK");
    } else context.status(400).fail("No data");
  } catch (error) {
    console.log("TCL: error", error);
    context.status(500).fail(error);
  }
};

"use strict";
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://func_mdb:27017/";
const connect = MongoClient.connect(url, { useUnifiedTopology: true });

const splitKey = key => ({
  bucket: key.split("/")[0],
  name: key.split("/")[1].split(".")[0],
  type: key.split("/")[1].split(".")[1]
});

module.exports = async (req, res) => {
  try {
    if (req.body.Key) {
      const record = req.body.Records.find(
        record => record.eventName === "s3:ObjectCreated:Put"
      );
      (await connect)
        .db("tp5")
        .collection("file")
        .update(
          {
            _id: req.body.Key
          },
          {
            $set: {
              _id: req.body.Key,
              ...splitKey(req.body.Key),
              date: record.eventTime,
              size: record.s3.object.size
            }
          },
          { upsert: true }
        );
      res.status(200).succeed("OK");
    } else res.status(400).fail("No data");
  } catch (error) {
    console.log("TCL: error", error);
    res.status(500).fail(error);
  }
};

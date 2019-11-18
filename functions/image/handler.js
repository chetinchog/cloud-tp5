"use strict";
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://func_mdb:27017/";
const connect = MongoClient.connect(url, { useUnifiedTopology: true });

module.exports = async (req, res) => {
  const {
    query: { size }
  } = req;
  try {
    const filter = {
      S: { $or: [{ heigth: { $lte: 500 } }, { width: { $lte: 500 } }] },
      M: { $or: [{ heigth: { $gt: 500 } }, { width: { $gt: 500 } }] },
      L: { $and: [{ heigth: { $gt: 100 } }, { width: { $gt: 100 } }] }
    };
    const listFile = await (await connect)
      .db("tp5")
      .collection("file")
      .find(filter[size])
      .sort({ name: 1 })
      .toArray();
    res.status(200).succeed(listFile);
  } catch (error) {
    console.log("TCL: error", error);
    res.status(500).fail(error);
  }
};

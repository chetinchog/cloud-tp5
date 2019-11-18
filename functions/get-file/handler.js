"use strict";
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://func_mdb:27017/";
const connect = MongoClient.connect(url, { useUnifiedTopology: true });

module.exports = async (req, res) => {
  const {
    path,
    query: { type, name, from, to }
  } = req;
  try {
    if (path === "/") {
      let filter;
      if (type) filter = { ...filter, type };
      if (name) filter = { ...filter, name: new RegExp(name, "gi") };
      if (from || to) {
        let listFilter = [];
        if (from) listFilter.push({ date: { $gte: new Date(from * 1000) } });
        if (to) listFilter.push({ date: { $lte: new Date(to * 1000) } });
        filter = { ...filter, $and: listFilter };
      }

      const listFile = await (await connect)
        .db("tp5")
        .collection("file")
        .find(filter)
        .toArray();
      res.status(200).succeed(listFile);
    } else {
      const file = await (await connect)
        .db("tp5")
        .collection("file")
        .findOne({ _id: path.substr(1) });
      res.status(200).succeed(file);
    }
  } catch (error) {
    console.log("TCL: error", error);
    res.status(500).fail(error);
  }
};

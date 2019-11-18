"use strict";
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://func_mdb:27017/";
const connect = MongoClient.connect(url, { useUnifiedTopology: true });

const pdfParse = require("pdf-parse");

const Minio = require("minio");
const MinioClient = new Minio.Client({
  endPoint: "minio",
  port: 9000,
  useSSL: false,
  accessKey: "minio",
  secretKey: "minio123"
});

const splitKey = key => ({
  bucket: key.split("/")[0],
  full: key.split("/")[1],
  name: key.split("/")[1].split(".")[0],
  type: key.split("/")[1].split(".")[1]
});

const getBuffer = (bucket, name) =>
  new Promise((resolve, reject) => {
    MinioClient.getObject(bucket, name, function(err, dataStream) {
      const listChunck = [];
      if (err) {
        return console.log(err);
      }
      dataStream.on("data", function(chunk) {
        listChunck.push(chunk);
      });
      dataStream.on("end", function() {
        resolve(Buffer.concat(listChunck));
      });
      dataStream.on("error", function(err) {
        console.log(err);
      });
    });
  });

module.exports = async (event, context) => {
  try {
    const { Key } = event.body;
    if (Key) {
      const info = splitKey(Key);
      const fileBuffer = await getBuffer(info.bucket, info.full);

      const data = await pdfParse(fileBuffer);

      (await connect)
        .db("tp5")
        .collection("file")
        .update(
          {
            _id: Key
          },
          {
            $set: {
              _id: Key,
              text: data.text
            }
          },
          { upsert: true }
        );

      context.status(200).succeed("OK");
    } else context.status(400).fail("No data");
  } catch (error) {
    console.log("TCL: error", error);
    context.status(500).fail(error);
  }
};

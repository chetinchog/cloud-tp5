"use strict";
const mongoose = require("mongoose");

const mongoConnection = new Promise((resolve, reject) =>
  mongoose.connect(
    "mongodb://func_mdb:27017/tp-final",
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, db) => (err ? reject(err) : resolve(db))
  )
);

const File = mongoose.model(
  "file",
  new mongoose.Schema({
    name: String,
    date: Date,
    size: Number,
    type: String,
    bucket: String,
    data: {
      type: mongoose.SchemaTypes.Mixed,
      required: false
    }
  })
);

const splitKey = key => ({
  bucket: key.split("/")[0],
  name: key.split("/")[1].split(".")[0],
  type: key.split("/")[1].split(".")[1]
});

module.exports = async (event, context) => {
  try {
    if (event.body.Key) {
      await mongoConnection;
      const record = event.body.Records.find(
        record => record.eventName === "s3:ObjectCreated:Put"
      );
      context.status(200).succeed(
        await new File({
          ...splitKey(event.body.Key),
          date: record.eventTime,
          size: record.s3.object.size
        }).save()
      );
    } else context.status(400).fail("No data");
  } catch (error) {
    console.log("TCL: error", error);
    context.status(500).fail(error);
  }
};

const EVENT = {
  EventName: "s3:ObjectCreated:Put",
  Key: "tp5/g413.jpg",
  Records: [
    {
      eventVersion: "2.0",
      eventSource: "minio:s3",
      awsRegion: "",
      eventTime: "2019-11-07T00:57:40Z",
      eventName: "s3:ObjectCreated:Put",
      userIdentity: { principalId: "minio" },
      requestParameters: {
        accessKey: "minio",
        region: "",
        sourceIPAddress: "172.19.0.1"
      },
      responseElements: {
        "x-amz-request-id": "15D4BB7023AFD306",
        "x-minio-deployment-id": "b4cf6570-810d-4920-a844-3aa913d2aece",
        "x-minio-origin-endpoint": "http://10.0.0.43:9000"
      },
      s3: {
        s3SchemaVersion: "1.0",
        configurationId: "Config",
        bucket: {
          name: "tp5",
          ownerIdentity: { principalId: "minio" },
          arn: "arn:aws:s3:::tp5"
        },
        object: {
          key: "g413.jpg",
          size: 285560,
          eTag: "3806344ebc5be1bd3051923658d4cf7f-1",
          contentType: "image/jpeg",
          userMetadata: { "content-type": "image/jpeg" },
          versionId: "1",
          sequencer: "15D4BB70290A1E4E"
        }
      },
      source: {
        host: "172.19.0.1",
        port: "",
        userAgent:
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"
      }
    }
  ]
};

const FILEURL =
  "http://localhost:9000/tp5/1568767528.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minio%2F20191109%2F%2Fs3%2Faws4_request&X-Amz-Date=20191109T013705Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=89e49f4214e745eb7ec8cd8b8b883125bfd1d020d1ff93012898989cc14988b3";

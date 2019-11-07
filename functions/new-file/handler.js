"use strict";

module.exports = (event, context) => {
  try {
    console.log("BODY", event.body);
    console.log("userIdentity", event.body.Records[0].userIdentity);
    console.log("requestParameters", event.body.Records[0].requestParameters);
    console.log("responseElements", event.body.Records[0].responseElements);
    console.log("s3", event.body.Records[0].s3);
    console.log("source", event.body.Records[0].source);
    context.status(200).succeed("Done!");
  } catch (e) {
    console.log("TCL: e", e);
    context.status(400).fail(e);
  }
};

// POST / - 500 Internal Server Error - ContentLength: 2
BODY = {
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
// POST / - 200 OK - ContentLength: 5

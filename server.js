const express = require("express");
const mongoose = require("mongoose");
const Messages = require("./models/dbMessages");
const Rooms = require("./models/rooms");
const Pusher = require("pusher");
const cors = require("cors");

const connection_url =
  process.env.MONGO_URI ||
  "mongodb+srv://admin:JtOIOvaXD9iEiSdD@cluster0.j6n9y.mongodb.net/whatsappdb?retryWrites=true&w=majority";
const pusher = new Pusher({
  appId: "1158221",
  key: "a968ab106b416a9b97d7",
  secret: "b3bd758c1c2df890271a",
  cluster: "ap2",
  useTLS: true,
});

mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.once("open", () => {
  console.log("conneted to mongo yeahh");
  const msgCollection = db.collection("rooms");
  const changeStream = msgCollection.watch({ fullDocument: "updateLookup" });
  changeStream.on("change", (change) => {
    if (change.operationType === "update") {
      const messageDetails = change.fullDocument;
      const lastmessage =
        messageDetails.messages[messageDetails.messages.length - 1];
      console.log(lastmessage);
      pusher.trigger("messages", "update", {
        name: lastmessage.name,
        message: lastmessage.message,
        timestamp: lastmessage.timestamp,
        received: lastmessage.received,
      });
    }
  });
});
db.on("error", (err) => {
  console.log("err connecting", err);
});

const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.status(200).send("hello world"));

app.get("/rooms/:id/messages/sync", (req, res) => {
  Rooms.findById(req.params.id, (err, room) => {
    if (err) res.status(500).send(err);
    else {
      res.status(200).send(room.messages);
    }
  });
});

// app.get("/rooms/:id/timestamp", (req, res) => {
//   Rooms.findById(req.params.id, (err, room) => {
//     if (err) res.status(500).send(err);
//     else {
//       const messages = room.messages;
//       const lastmessage = messages[messages.length - 1];
//       res.status(200).send(lastmessage.message);
//     }
//   });
// });

app.post("/rooms/:id/messages/new", (req, res) => {
  const { message, name, timestamp, received } = req.body;
  Rooms.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        messages: {
          message: message,
          name: name,
          timestamp: timestamp,
          received: received,
        },
      },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});
app.get("/rooms/sync", (req, res) => {
  Rooms.find((err, data) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(data);
  });
});
app.get("/rooms/:id", (req, res) => {
  Rooms.findById(req.params.id, (err, room) => {
    if (err) res.status(500).send(err);
    else res.status(200).json(room);
  });
});
app.post("/rooms/new", (req, res) => {
  const room = req.body;
  Rooms.create(room, (err, data) => {
    if (err) res.status(500).send(err);
    else res.status(201).send(data);
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.listen(port, () => console.log(`Listening on localhost:${port}`));

const mongoose = require("mongoose");

const SocketModel = new mongoose.Schema(
  {
    t: String,
    socketId: String,
    sessionId: String,
    auth: String,
    device_detect: String,
    geolocation: String,
  },
  {
    timestamps: true,
  }
);

const Socket = mongoose.model("socket", SocketModel, "socket");
export default Socket


import mongoose from "mongoose";

import {Bank, Post, Role, User, Socket} from '../model'

const modelExists =()=>{
  Bank.find({}, async(err, result) => {
    if (result.length > 0) {
      console.log('Found bank');
    } else {
      console.log('Not found, creating');
      let newSettings = new Bank({});
      await newSettings.save();
      await Bank.remove({})
    }
  });

  Post.find({}, async(err, result) => {
    if (result.length > 0) {
      console.log('Found post');
    } else {
      console.log('Not found, creating');
      let newSettings = new Post({});
      await newSettings.save();
      await Post.remove({})
    }
  });

  Role.find({},async(err, result) =>{
    if (result.length > 0) {
      console.log('Found role');
    } else {
      console.log('Not found, creating');
      let newSettings = new Role({});
      newSettings.save();

      await Role.remove({})
    }
  });

  Socket.find({}, async(err, result)=> {
    if (result.length > 0) {
      console.log('Found socket');
    } else {
      console.log('Not found, creating');
      let newSettings = new Socket({});
      await newSettings.save();

      await Socket.remove({})
    }
  });

  User.find({}, async(err, result)=> {
    if (result.length > 0) {
      console.log('Found user');
    } else {
      console.log('Not found, creating');
      let newSettings = new User({});
      await newSettings.save();

      await User.remove({})
    }
  });
}

// TODO: initial and connect to MongoDB
mongoose.Promise = global.Promise;
// mongoose.connect("YOUR_MONGODB_URI", { useNewUrlParser: true });

// uri
mongoose.connect(
  "mongodb://mongo1:27017,mongo2:27017,mongo3:27017/bl?replicaSet=rs",
  {
    useNewUrlParser: true,
    useFindAndModify: false, // optional
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);

const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "mongoose : connection error:"));
connection.once("open", async function () {
  // we're connected!
  console.log("mongoose : Connected successfully to database!");

  // mongoose.model("bank", BankModel);
  // mongoose.model("post", PostModel);
  // mongoose.model("role", RoleModel);
  // mongoose.model("room", RoomModel);
  // mongoose.model("user", UserModel);

  modelExists()
});

export default connection;
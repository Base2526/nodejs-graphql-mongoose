import { ApolloServer } from "apollo-server";
// import mongoose from "mongoose";
import { elastic } from "./elastic"
import connection from './mongo' 

// TODO: import TypeDefs and Resolvers
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

import PostModel from "./model/PostModel"

let PORT = /*process.env.PORT || */ 4040;


// // TODO: initial and connect to MongoDB
// mongoose.Promise = global.Promise;
// // mongoose.connect("YOUR_MONGODB_URI", { useNewUrlParser: true });

// // uri
// mongoose.connect(
//   "mongodb://mongo1:27017,mongo2:27017,mongo3:27017/bl?replicaSet=rs",
//   {
//     useNewUrlParser: true,
//     useFindAndModify: false, // optional
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//   }
// );
// const dboose = mongoose.connection;
// dboose.on("error", console.error.bind(console, "mongoose : connection error:"));
// dboose.once("open", async function () {
//   // we're connected!
//   console.log("mongoose : Connected successfully to database!", PORT);
// });

// TODO: create Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen(PORT).then( async({ url }) => {
  console.log(`🚀  Server ready at ${url}`);

  let exists = await elastic.indices.exists({
    index: process.env.ELASTIC_INDEX,
  });

  console.log("elastic exists.statusCode :", exists.statusCode)
  if (exists.statusCode === 404){
    await elastic.indices.create({
      index: process.env.ELASTIC_INDEX,
      body: {},
    });
  }

  PostModel.watch().on("change", async (data) => {
    console.log("PostModel : change")
  });
});

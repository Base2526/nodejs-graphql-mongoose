// import { ApolloServer } from "apollo-server";

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import cors from 'cors'

import socketIO from 'socket.io'

// import mongoose from "mongoose";
import { elastic } from "./elastic"
import connection from './mongo' 

// TODO: import TypeDefs and Resolvers
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

import {Bank, Post, Role, User, Comment, Mail} from './model'

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

/*
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
*/

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  let io = socketIO(httpServer)

  app.use(cors())

  server.applyMiddleware({ app });
  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);

  io.on('connection', (socket) => {
    console.log('A client connected', socket)
  });
}

startApolloServer(typeDefs, resolvers) 

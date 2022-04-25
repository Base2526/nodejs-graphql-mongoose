import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";

// TODO: import TypeDefs and Resolvers
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

// TODO: initial and connect to MongoDB
mongoose.Promise = global.Promise;
// mongoose.connect("YOUR_MONGODB_URI", { useNewUrlParser: true });
mongoose.connect(
  "mongodb://mongo1:27017,mongo2:27017,mongo3:27017/bl?replicaSet=rs",
  {
    useNewUrlParser: true,
    useFindAndModify: false, // optional
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);
const dboose = mongoose.connection;
dboose.on("error", console.error.bind(console, "mongoose : connection error:"));
dboose.once("open", async function () {
  // we're connected!
  console.log("mongoose : Connected successfully to database!");
});

// TODO: create Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen(3000).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

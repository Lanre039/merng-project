const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./config.js");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const pubSub = new PubSub();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubSub }),
});

server
  .listen(5000, () => {
    mongoose.connect(
      MONGODB_URI,
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
      },
      (err, success) => {
        if (err) {
          console.log("An error occurred while connecting to the database");
          return;
        }
        console.log("Successfully connected to the database");
      }
    );
  })
  .then((res) => console.log(`Server listening on port: ${res.url}`));

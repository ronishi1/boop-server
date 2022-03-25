// const { ApolloServer, gql } = require('apollo-server');
//
// // A schema is a collection of type definitions (hence "typeDefs")
// // that together define the "shape" of queries that are executed against
// // your data.
// const resolvers = require('./resolvers/root-resolver');
// const { typeDefs }  = require('./typedefs/root-def');
//
// // The ApolloServer constructor requires two parameters: your schema
// // definition and your set of resolvers.
// const server = new ApolloServer({ typeDefs, resolvers });
//
// // The `listen` method launches a web server.
// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const resolvers = require('./resolvers/root-resolver');
const { typeDefs }  = require('./typedefs/root-def');
const serverOptions = require('./server-config');
require('dotenv').config();
const { MONGO_URI, BACKEND_PORT, CLIENT_LOCAL_ORIGIN, SERVER_LOCAL_DOMAIN } = process.env;

// create express server handling our middleware
const app = express();

// since we presume cors is enabled, this next step is not optional, so cors
// is enable here instead of in options
app.use(cors({ origin: "https://studio.apollographql.com", credentials: true }));

const corsPolicy = async(req, res, next) => {
	res.set("Access-Control-Allow-Origin", req.headers.origin);
    res.set("Access-Control-Allow-Credentials", true);
	next();
}

app.options('*', cors());
app.use(corsPolicy);


// middleware application is configured to happen in server-config.js
serverOptions(app);

const server = new ApolloServer({
    typeDefs: typeDefs,
	resolvers: resolvers,
	context: ({req, res}) => ({ req, res })
});

server.start().then(res => {
  server.applyMiddleware({ app , cors: false});
});

mongoose.connect(MONGO_URI, {useNewUrlParser: true , useUnifiedTopology: true})
        .then(() => {
            app.listen({ port: process.env.PORT || 4000 }, CLIENT_LOCAL_ORIGIN, () => {
                console.log(`Server ready at ${SERVER_LOCAL_DOMAIN}:${BACKEND_PORT}`);
            })
        })
        .catch(error => {
            console.log(error)
        });

// async function startApolloServer(typeDefs, resolvers) {
//   // create express server handling our middleware
//   const app = express();
//
//   // since we presume cors is enabled, this next step is not optional, so cors
//   // is enable here instead of in options
//   app.use(cors({ origin: CLIENT_LOCAL_ORIGIN, credentials: true }));
//
//   const corsPolicy = async(req, res, next) => {
//   	res.set("Access-Control-Allow-Origin", req.headers.origin);
//       res.set("Access-Control-Allow-Credentials", true);
//   	next();
//   }
//
//   app.options('*', cors());
//   app.use(corsPolicy);
//
//
//   // middleware application is configured to happen in server-config.js
//   serverOptions(app);
//
//   const server = new ApolloServer({
//       typeDefs: typeDefs,
//   	resolvers: resolvers,
//   	context: ({req, res}) => ({ req, res })
//   });
//   await server.start();
//   server.applyMiddleware({ app , cors: false});
//   mongoose.connect(MONGO_URI, {useNewUrlParser: true , useUnifiedTopology: true})
//           .then(() => {
//               app.listen({ port: BACKEND_PORT }, CLIENT_LOCAL_ORIGIN, () => {
//                   console.log(`Server ready at ${SERVER_LOCAL_DOMAIN}:${BACKEND_PORT}`);
//               })
//           })
//           .catch(error => {
//               console.log(error)
//           });
// }
//
// startApolloServer(typeDefs,resolvers);
// since the express server has cors configured, cors on the apollo server
// can be false; passing the same options as defined on the express instance
// works as well
// server.applyMiddleware({ app , cors: false});
//
// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });

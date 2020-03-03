import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import express_user_ip from "express-ip";
import { buildFederatedSchema } from "./helpers/buildFederatedSchema";
//?  decorators metadata

import connectDB from "./DB/index";
import { CommentaryResolver } from "./resolvers/CommentaryResolver";
import {
  Commentary,
  Challenge,
  User,
  resolveCommentaryReference
} from "./schema/CommentarySchema";
const PORT: string = process.env.PORT || "3000";

(async () => {
  try {
    // Initialize the app
    const app = express();
    app.use(express_user_ip().getIpInfoMiddleware); //* get the user location data

    const server = new ApolloServer({
      schema: await buildFederatedSchema(
        {
          resolvers: [CommentaryResolver],
          orphanedTypes: [Commentary, Challenge, User]
        },
        {
          Commentary: { __resolveReference: resolveCommentaryReference }
        }
      ),
      context: req => req,
      formatError: err => {
        return err;
      },
      tracing: false,
      playground: true
    });
    // The GraphQL endpoint

    server.applyMiddleware({ app, path: "/graphql" });

    // Start the server
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Go to http://localhost:${PORT}/graphiql to run queries!`);
    });
  } catch (error) {
    console.log(error);
  }
})();

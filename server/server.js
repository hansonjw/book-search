const express = require('express');

// import Apollo Server
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

const path = require('path');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

// replace with graphQL routes
// const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// integrate our Apollo server with the Express application as middleware
server.applyMiddleware({ app });

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// replace with graphQL routes
// app.use(routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`)
    // console log the URL to test GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
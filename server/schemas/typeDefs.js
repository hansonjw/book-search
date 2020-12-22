// import the gql tagged template function
const { gql } = require('apollo-server-express');

//define, create typeDefs
const typeDefs = gql `
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        _id: ID
        bookId: String
        authors: [String]
        description: String
        title: String  
        image: String
        link: String
        user: User              
    }

    type Query {
        me: User
        getSingleUser: User
    }

    type Mutation {
        createUser(username: String!, email: String!, password: String!): Auth 
        login(email: String!, password: String!): Auth
        saveBook(user: String!, body: String!): User
        deleteBook(user: String!, params: String!): User
    }

    type Auth {
        token: ID!
        user: User
    }
`;

module.exports = typeDefs;
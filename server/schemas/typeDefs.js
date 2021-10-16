const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
    bookCount: Int

}

type Book {
    authors: String
    description: String
    bookId: String
    image: String
    link: String
    title: String

}

# Set up an Auth type to handle returning data from a user creating or user login
type Auth {
  token: ID!
  user: User
}

# For reading data

type Query {
    users: [Users]
    me: User
}

# For Creating, Updating and Deleting

type Mutation {

    # add user mutation
    addUser(username: String!, email: String!, password: string!): Auth

    # login mutation
    login(email: String!, password: String!): Auth

    # Save a Book: Accepts a book author's array, description, title, bookId, image, and link as parameters; returns a User type
    saveBook(authors: [String], description: String, title: String, bookID: String, image: String) : User

    # Remove a Book: Accepts a book's bookId as a parameter; returns a User type.
    removeBook(bookID: String) : User
}

` ;

module.exports = typeDefs;
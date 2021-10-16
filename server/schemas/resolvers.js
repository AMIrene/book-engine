const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {

//query where me returns a user 

    Query: {
      uers: async () => {
        return User.find();
      },
  
      user: async (parent, { userId }) => {
        return User.findOne({ _id: userId });
      },
      // By adding context to our query, we can retrieve the logged in user without specifically searching for them
      me: async (parent, args, context) => {
        if (context.user) {
          return User.findOne({ _id: context.user._id });
        }
        throw new AuthenticationError('You need to be logged in!');
      },
    },

//mutations
    Mutation: {
        
//mutation functionality for sign up/adding user
addUser: async (parent, { username, email, password }) => {
    const user = await User.create({ username, email, password });
    const token = signToken(user);

    return { token, user };
    },
        
//mutation functionality for login      
login: async (parent, { email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AuthenticationError('No user with this email found!');
    }

    const correctPw = await user.isCorrectPassword(password);

    if (!correctPw) {
      throw new AuthenticationError('Incorrect password!');
    }

    const token = signToken(user);
    return { token, user };
  },


//mutation functionality for saving a book

        saveBook: async (parent, { authors, description, bookID, image, link }) => {
            return User.findOneAndUpdate(
                { _id: userID },
                {
                    $addToSet
                }
    )
}

// mutation functionality for removing a book

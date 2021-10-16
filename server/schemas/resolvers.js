const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {

    //query where me returns a user 

    Query: {
       
        // By adding context to our query, we can retrieve the logged in user without specifically searching for them
        me: async (parent, args, context) => {
            if (context.user) {
                const userDetails = await User.findOne({ _id: context.user._id })
                    .select('-_v -password')
                return userDetails;
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
        // Add a third argument to the resolver to access data in our context

        saveBook: async (parent, { authors, description, bookId, image, link }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: authors, description, bookId, image, link } },
                    { new: true, runValidators: true }
                    
                );
                return updatedUser;
            }

            throw new Error('Your book could not be saved!')
        },
      
        // mutation functionality for removing a book
        // Add a third argument to the resolver to access data in our context
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
                return updatedUser;
            }

                throw new Error('Your book could not be removed!')
            }
        }
    };
            
    
            module.exports = resolvers;
const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password');
                
                return userData;
            }
            throw new AuthenticationError("login error...");
        },
        getSingleUser: async (parent, { username }) => {
            return User.findOne({ username });
            // .select('-__v -password');
            // .populate('savedBooks');
        },
        // get all users
        users: async () => {
            return User.find();
        }
    },

    Mutation: {
        createUser: async (parent, args) => {
            console.log("create user Mutation");
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            
            if(!user) {
                throw new AuthenticationError('login error...please check your credentials');
            }

            const correctPassword = await user.isCorrectPassword(password);

            if (!correctPassword) {
                throw new AuthenticationError('login error...please check your credentials');
            }

            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, { input }, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    { new: true, runValidators: true }
                );
                console.log("book added...");
                return updatedUser;
            }
            throw new AuthenticationError("You must be logged in...");
        },

        deleteBook: async (parent, param, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks:  { _id: param } } },
                    { new: true }
                );
                console.log("book removed...");
                return updatedUser;
            }
            throw new AuthenticationError('login error...please check your credentials');
        }
    }


};

module.exports = resolvers;

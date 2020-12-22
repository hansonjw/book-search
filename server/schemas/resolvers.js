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
            return User.findOne({ username })
            .select('-__v -password')
            .populate('savedBooks');
        }
    },

    Mutation: {
        createUser: async (parent, args) => {
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

        saveBook: async (parent, { user,  body }) => {
            console.log(user);
            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $addToSet: { savedBooks: body } },
                    { new: true, runValidators: true }
                );
                return updatedUser;
            } catch (err) {
                console.log(err);
                return res.status(400).json(err);
            }
        },

        deleteBook: async (parent, { user, params }, context) => {
            if (context.user) {
                await User.findOneAndUpdate(
                    { _id: user._id },
                    { $pull: { savedBooks:  { bookId: params.bookId } } },
                    { new: true }
                ).populate('savedBooks');
                console.log("book removed...");
                return user;
            }
            throw new AuthenticationError('login error...please check your credentials');
        }
    }


};

module.exports = resolvers;

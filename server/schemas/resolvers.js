const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    searchBooks: async (parent, { searchTerm }, context) => {
      if (context.user) {
        // Implement logic to search for books using Google Books API or any other source
        const searchBooks = await User.findById(context.user._id);
        return searchBooks;
      } else {
        throw new AuthenticationError('You need to be logged in to search for books.');
      }
    },
    savedBooks: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate('savedBooks');
        return user.savedBooks;
      }
      throw new AuthenticationError('You need to be logged in to view saved books.');
    },
  },
  Mutation: {
    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: input } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in to save books.');
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in to remove books.');
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Invalid credentials');
      }
      const token = signToken(user);
      return { token, user };
    },
    signup: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    logout: async (parent, args, context) => {
      if (context.user) {
        return { message: 'Successfully logged out' };
      }
      throw new AuthenticationError('You need to be logged in to log out.');
    },
  },
};

module.exports = resolvers;
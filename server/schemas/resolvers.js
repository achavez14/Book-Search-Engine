const { User, Book } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    // Query to search for books based on a search term
    searchBooks: async (parent, { searchTerm }) => {
      // Implement logic to search for books using Google Books API or any other source
      // Return the search results
    },

    // Query to get all saved books for the logged-in user
    savedBooks: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate('savedBooks');
        return user.savedBooks;
      }
      throw new AuthenticationError('You need to be logged in to view saved books.');
    },
  },

  Mutation: {
    // Mutation to save a book to the user's account
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

    // Mutation to remove a book from the user's saved books
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

    // Mutation for user login
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

    // Mutation for user signup
    signup: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    // Mutation for user logout
    logout: async (parent, args, context) => {
      if (context.user) {
        return { message: 'Successfully logged out' };
      }
      throw new AuthenticationError('You need to be logged in to log out.');
    },
  },
};

module.exports = resolvers;
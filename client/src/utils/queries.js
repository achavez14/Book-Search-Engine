import { gql } from '@apollo/client';

export const QUERY_BOOKS = gql`
  query searchBooks($searchTerm: String!) {
    searchBooks(searchTerm: $searchTerm) {
      title
      authors
      description
      image
      link
    }
  }
`;

export const QUERY_SAVED_BOOKS = gql`
  query savedBooks {
    savedBooks {
      title
      authors
      description
      image
      link
    }
  }
`;

export const QUERY_LOGIN = gql`
  query login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const QUERY_SIGNUP = gql`
  query signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const QUERY_SAVE_BOOK = gql`
  mutation saveBook($input: BookInput!) {
    saveBook(input: $input) {
      _id
      username
      email
      savedBooks {
        title
        authors
        description
        image
        link
      }
    }
  }
`;

export const QUERY_REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      _id
      username
      email
      savedBooks {
        title
        authors
        description
        image
        link
      }
    }
  }
`;
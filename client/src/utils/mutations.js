import gql from 'graphql-tag';


export const LOGIN_USER = gql`
    mutation login(#email: String!, $password: String!) {
        login(email: $emaail, password: $password){
            token
            user {
                _id
                username
            }
        }
    }

`;


export const ADD_USER = gql`
    mutation createUser($username: String!, $email: String!, $password: String!) {
        createUser(username: $username, email: $email, password: $password) {
            token
            user{
                _id
                username
                email
            }
        }
    }
`;


export const SAVE_BOOK = gql`
    mutation saveBook($input: BookSelection) {
        saveBook(input: $input) {
            _id
            username
            email
            savedBooks {
                authors
                description
                title
                bookId
                image
                link
            }
        }
    }
`;


export const REMOVE_BOOK = gql`
    mutation deleteBook($bookId: String) {
        deleteBook(bookId:$bookId){
            username
            email
            _id
            savedBooks {
                _id
                bookId
                authors
                description
                title
                bookId
                image
                link
            }
        }
    }
`;
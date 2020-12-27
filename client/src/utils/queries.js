import gql from 'graphql-tag';

// developers insight, learning: this is what is put into graph ql playground...
export const QUERY_ME = gql`
    {
        me {
            _id
            username
            email
            savedBooks {
                _id
                authors
                description
                bookId
                image
                link
                title
            }
        }
    } 
`;
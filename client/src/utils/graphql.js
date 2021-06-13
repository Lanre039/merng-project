import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      username
      body
      createdAt
      likes {
        username
      }
      likeCount
      commentCount
      comments {
        body
        username
        createdAt
      }
    }
  }
`;

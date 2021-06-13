import React, { useRef, useState } from "react";
import { Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

function CommentForm({ postId }) {
  const [comment, setComment] = useState("");
  const commentInputRef = useRef(null);

  const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
    variables: { postId, body: comment },
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
  });

  return (
    <Form>
      <p>Create Comment:</p>
      <div className="ui action input fluid">
        <input
          type="text"
          placeholder="Comment..."
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          ref={commentInputRef}
        />
        <button
          type="submit"
          className="ui button teal"
          disabled={comment.trim() === ""}
          onClick={createComment}
        >
          Submit
        </button>
      </div>
    </Form>
  );
}

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default CommentForm;

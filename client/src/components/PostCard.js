import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Card, Image, Button, Label, Icon } from "semantic-ui-react";
import moment from "moment";
import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import MyPopup from "./MyPopup";

function PostCard({
  history,
  post: { id, body, createdAt, username, likeCount, commentCount, likes },
}) {
  const { user } = useContext(AuthContext);
  function deletePostCallback() {
    history.push("/");
  }

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <MyPopup content="Comment on post">
          <Button labelPosition="right" as={Link} to={`/post/${id}`}>
            <Button color="teal" basic>
              <Icon name="comments" />
            </Button>
            <Label basic color="teal" pointing="left">
              {commentCount}
            </Label>
          </Button>
        </MyPopup>
        {user && user.username === username && (
          <DeleteButton postId={id} callback={deletePostCallback} />
        )}
      </Card.Content>
    </Card>
  );
}

export default PostCard;

const { UserInputError, AuthenticationError } = require("apollo-server");
const Post = require("../../models/post");
const auth = require("../../utils/auth");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = await auth(context);

      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "Comment body must not be empty",
          },
        });
      }

      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError("Post not found");
        }

        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });

        return await post.save();
      } catch (error) {
        throw new Error(error);
      }
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      const { username } = await auth(context);
      try {
        const post = await Post.findById(postId);
        if (post) {
          const commentIndex = post.comments.findIndex(
            ({ id }) => id === commentId
          );

          if (post.comments[commentIndex].username === username) {
            post.comments.splice(commentIndex, 1);
            return await post.save();
          } else {
            throw new AuthenticationError("Action not allowed");
          }
        } else {
          throw new UserInputError("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

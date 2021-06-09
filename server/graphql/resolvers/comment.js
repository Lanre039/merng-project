const { UserInputError } = require("apollo-server");
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

        return post.save();
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

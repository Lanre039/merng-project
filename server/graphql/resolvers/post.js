const { AuthenticationError, UserInputError } = require("apollo-server");
const { argsToArgsConfig } = require("graphql/type/definition");
const Post = require("../../models/post");
const auth = require("../../utils/auth");

module.exports = {
  Query: {
    async getPosts() {
      try {
        // SORT BY DECENDING ORDER
        return await Post.find().sort({ createdAt: -1 });
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new Error("Post not found");
        }
        return post;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = auth(context);

      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      const post = new Post({
        body,
        username: user.username,
        user: user._id,
        createdAt: new Date().toISOString(),
      });

      try {
        const newPost = await post.save();
        context.pubSub.publish("NEW_POST", { newPost });
        return newPost;
      } catch (error) {
        throw new Error(error);
      }
    },
    async deletePost(_, { postId }, context) {
      const user = auth(context);

      try {
        const post = await Post.findById(postId);
        if (post.username !== user.username) {
          throw new AuthenticationError("Action not allowed!");
        }

        await post.delete();

        return "Post deleted Successfully!";
      } catch (error) {
        throw new Error(error);
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = auth(context);

      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError("Post not found!");
        }

        if (post.likes.find((like) => like.username === username)) {
          // UNLIKE POST
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          //LIKE POST
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }
        return await post.save();
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Subcription: {
    newPost: {
      subscribe: (_, __, { pubSub }) => pubSub.asyncIterator("NEW_POST"),
    },
  },
};

const postsResolver = require("./post");
const userResolver = require("./user");
const commentsResolver = require("./comment");

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postsResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...postsResolver.Mutation,
    ...commentsResolver.Mutation,
  },
  Subscription: {
    ...postsResolver.Subcription,
  },
};

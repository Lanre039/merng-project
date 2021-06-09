const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const { JWT_SECRET } = require("../../config");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validator");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

// register(parent, args, context, info)
module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { valid, errors } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "User not found!";
        throw new UserInputError("User not found!", { errors });
      }

      const doesPasswordMatch = await bcrypt.compare(password, user.password);
      if (!doesPasswordMatch) {
        errors.general = "Wrong Crendentials";
        throw new UserInputError("Wrong Crendentials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(
      _,
      { registerInput: { email, password, username, confirmPassword } }
    ) {
      // VALIDATE USER INPUT
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // CHECK IF USER EXIST
      const userExist = await User.findOne({ username });
      if (userExist) {
        throw new UserInputError("Username exists", {
          errors: {
            username: "Username exists",
          },
        });
      }

      // HASH PASSWORD
      password = await bcrypt.hash(password, 12);

      //SAVE USER DETAILS
      const user = new User({
        email,
        password,
        username,
        createdAt: new Date().toISOString(),
      });

      const result = await user.save();

      // GENERATE TOKEN
      const token = generateToken(result);

      return {
        ...result._doc,
        id: result._id,
        token,
      };
    },
  },
};

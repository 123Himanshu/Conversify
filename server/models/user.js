const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { setUser } = require("../services/auth");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    emailVerified: {
      type: Date,
      default: Date.now,
    },
    image: {
      type: String,
    },
    hashedPassword: {
      type: String,
    },
    salt: {
      type: String,
    },
    conversationIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
      },
    ],
    seenMessageIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    accounts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  console.log(user);
  const salt = bcrypt.genSaltSync(6);
  this.salt = salt;
  this.hashedPassword = bcrypt.hashSync(this.hashedPassword, salt);
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    console.log(user);
    if (!user) throw new Error("User Not Found");
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) throw new Error("Incorrect Password");
    return (token = setUser(user));
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

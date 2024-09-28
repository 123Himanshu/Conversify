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
    account: {
      type: Boolean,
      default: false,
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
    online: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("hashedPassword")) return next();
  const salt = bcrypt.genSaltSync(6);
  this.salt = salt;
  this.hashedPassword = bcrypt.hashSync(this.hashedPassword, salt);
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User Not Found");
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) throw new Error("Incorrect Password");
    return (token = setUser(user));
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

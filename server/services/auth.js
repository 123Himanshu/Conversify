const jwt = require("jsonwebtoken");
const secretKey = "#Sourav#";

const setUser = (user) => {
  const token = jwt.sign(
    {
      id: user._id,
      username: user.name,
      email: user.email,
    },
    secretKey
  );
  return token;
};

const getUser = (token) => {
  if (!token) return;
  try {
    const user = jwt.verify(token, secretKey);
    if (user) return user;
  } catch (error) {
    console.log(error);
    return null;
  }
  return null;
};

module.exports = { setUser, getUser };

const restrictToLoggedInUserOnly = (req, res, next) => {
  const userToken = req.cookies?.token;
};

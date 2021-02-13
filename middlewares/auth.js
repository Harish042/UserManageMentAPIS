const jwt = require("jsonwebtoken");
const User = require("../models/Users");
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
        return res.status(401).send({
            'message': 'Unauthorized to access the route'
        })
  }
  let decode = {};
  try {
    decode = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).send({
          'message': 'Unauthorized to access the route'
      })
    }
    req.user = await User.findById(decode._id);
    next();
  } catch (error) {
    return res.status(401).send({
        'message': 'Unauthorized to access the route'
    })
  }
};
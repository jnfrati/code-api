const jwt = require('jsonwebtoken');
const {key} = require('../config');
console.log(key);
module.exports = (req, res, next) => {
  
  // By authorization header
  // const authHeader = req.get('Authorization');
  // if (!authHeader) {
  //   req.isAuth = false;
  //   return next();
  // }
  

  // By Cookie Authorization
  const token = req.cookies.token;
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, key);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }



  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();

};
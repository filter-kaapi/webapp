const bcrypt = require('bcrypt');
const User = require('../database/models/user');

async function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log("The authehader " + authHeader);

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    console.log("authreader not wokring")
    return res.status(401).json({ message: 'Invalid Credentials' });
  }

  const base64Credentials = authHeader.split(' ')[1];

  console.log("thebase credientials " + base64Credentials);

  const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('ascii');

  console.log("the decoded credientials " + decodedCredentials);

  const [email, password] = decodedCredentials.split(':');

  console.log("email" + email);

  console.log("password" + password);

  if (!email || !password) {
    return res.status(401).json({ message: 'Invalid Credentials' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid Credentials' });
    }
    //TODO: remove json
    const checkPassword = await bcrypt.compare(password, user.password);
    // console.log(`Password from request: ${password}`);
    // console.log(`Hashed password in DB: ${user.password}`);
    // console.log(`Password comparison result: ${checkPassword}`);

    if (!checkPassword) {
      console.log('Password mismatch');
      return res.status(401).json({ message: 'Invalid Credentials' });
    }
    //TODO: remove json
    req.user = user;
    console.log("line before next() moving to the next htinguy");
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(400).json({ message: 'Bad request' });
  }
}

module.exports = authenticate;

const bcrypt = require('bcrypt');
const User = require('../database/models/user');

async function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [email, password] = decodedCredentials.split(':');

  if (!email||!password) {
    return res.status(401).json({ message: 'Invalid authorization credentials - missing username or password' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = authenticate;

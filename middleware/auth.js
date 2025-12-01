const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next){
  const auth = req.headers.authorization;

  if(!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = auth.split(' ')[1];

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "DEFAULT_DEV_SECRET";

    const payload = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(payload.id);

    if(!user) return res.status(401).json({ error: 'Unauthorized' });

    req.user = { id: user._id, email: user.email, role: user.role };
    next();
  } catch(e){
    return res.status(401).json({ error: 'Invalid token' });
  }
};

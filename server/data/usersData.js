const bcrypt = require('bcryptjs');

module.exports = [
  {
    id: 1,
    login: 'John',
    password: bcrypt.hashSync('John'),
  },
  {
    id: 2,
    login: 'Anna',
    password: bcrypt.hashSync('Anna'),
  },
];

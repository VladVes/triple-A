import bcrypt from 'bcryptjs';

export default [
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

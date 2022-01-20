import bcrypt from 'bcryptjs';

export default [
  {
    id: 1,
    login: 'user1',
    password: bcrypt.hashSync('user1'),
  },
  {
    id: 2,
    login: 'user2',
    password: bcrypt.hashSync('user2'),
  },
];

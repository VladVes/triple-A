import rc from 'rc';

export default rc('JWT', {
  port: process.env.PORT || 3000,
  connection: './data',
});

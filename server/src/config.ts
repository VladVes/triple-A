import rc from 'rc';

export default rc('tripleA', {
  port: process.env.PORT || 3000,
  connection: './data',
});

module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    // '@babel/preset-typescript',
  ],
  "plugins": ["transform-default-import"]
};
// export default {
//   presets: [
//     ['@babel/preset-env', {targets: {node: 'current'}}],
//     // '@babel/preset-typescript',
//   ],
//   "plugins": ["transform-default-import"]
// };
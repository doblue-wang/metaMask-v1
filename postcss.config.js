module.exports = {
    plugins: {
      'postcss-pxtorem': {
        rootValue: 10, 
        propList: ['*'], 
        selectorBlackList: [],
        replace: true, // 
        mediaQuery: false,
        minPixelValue: 1, 
      },
    },
  };
  
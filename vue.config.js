module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: 'https://barebone-aventis.programmers.us/meetup.php', // Replace with your API endpoint
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      }
    }
  };
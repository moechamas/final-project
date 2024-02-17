module.exports = function override(config, env) {
    // Add the devServer configuration to disable host checking
    if (env === 'development') {
      config.devServer.disableHostCheck = true;
    }
  
    return config;
  };
  
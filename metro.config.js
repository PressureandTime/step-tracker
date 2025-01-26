const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable network inspection
config.transformer.minifierConfig = {
  ...config.transformer.minifierConfig,
  keep_classnames: true,
  keep_fnames: true,
  mangle: false,
};

// Enable source maps for debugging
config.transformer.minifierPath = require.resolve('metro-minify-terser');
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// Enable Flipper support
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      if (req.url.startsWith('/debugger-ui')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;


process.env['NODE_PATH'] = process.env.NODE_PATH || __dirname;

switch (process.env.BUILD_ENV) {
case 'prod':
case 'production':
    module.exports = require('./build/webpack.prod');
    break;
case 'test':
case 'testing':
case 'staging':
    module.exports = require('./build/webpack.staging');
    break;
case 'dev':
case 'development':
default:
    module.exports = require('./build/webpack.dev');
}

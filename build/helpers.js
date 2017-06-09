const webpackMerge = require('webpack-merge');
const colors = require('colors');
const commonConfig = require( "./webpack.common");

/**
 * merge a webpack config object with the common config
 */
exports.mergeWebpackConfig = function(config) {
    return webpackMerge(commonConfig, config);
}

/**
 * merge env variables with the common env variables
 */
exports.mergeEnvironment = function(environment) {

    if(!environment || !environment.ENV) {
        throw new Error("The environment does not contain an ENV property");
    }

    console.log(`Merging environment variables for: ${environment.ENV}`.green);

    let isProd = (environment.ENV === 'production') || (environment.ENV === 'prod');
    let commonGlobals = require(`../config/common.js`);
    let environmentGlobals = require(`../config/${environment.ENV}.js`);
    console.log(environmentGlobals);


    return webpackMerge(commonGlobals, environmentGlobals, environment, { IS_PROD: isProd });
};

/**
 * format the app globals for the DefinePlugin
 */
exports.configureAppGlobals = function(env, globals) {
    return {
        'process.env': { 
            'NODE_ENV': JSON.stringify(env),
            'CONFIG' :  JSON.stringify(globals)
        }
    }
};

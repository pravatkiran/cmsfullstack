const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.make')({DEV: true});
const appconfig = require('./server/config/local.env');
const devServerEntry = [`webpack-dev-server/client?http://localhost:${appconfig.clientPort}/`, 'webpack/hot/dev-server'];

config.entry.app = devServerEntry.concat(config.entry.app);

const compiler = webpack(config);

export const server = new WebpackDevServer(compiler, {
    contentBase: './client/',
    hot: true,
    historyApiFallback: true,

    stats: {
        modules: false,
        cached: false,
        colors: true,
        chunk: false
    },
    quiet: false,
    noInfo: false,

    proxy: {
        '/controller':{
            target: 'http://localhost:4000',
            secure: false,
        },
        '/auth':{
            target: 'http://localhost:4000',
            secure: false
        },
    }
});

/**
 * Starts the dev server
 * @returns { Promise}
 */

 export function start(){
     return new Promise(resolve =>{
         server.listen(appconfig.clientPort, 'localhost', resolve);
     })
 }
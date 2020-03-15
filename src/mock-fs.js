//https://github.com/googleapis/google-api-nodejs-client/issues/1775
// add:
// fs: path.resolve(__dirname, '../../../src/mock-fs.js'),
// to node_modules/react_scripts/config/webpack-config.js in resolve/alias
module.exports = {
    readFileSync() {
    },
    readFile() {
    },
};
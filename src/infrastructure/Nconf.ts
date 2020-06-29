import nconf from 'nconf';
import path from 'path';

const configPath = path.resolve(__dirname, '../../config/default.json');

const envConf = nconf.argv({
    'p': {
        alias: 'http:port',
        describe: 'The port to listen on',
    },
}).env('__').file({file: configPath});

export default envConf;
import config from './config.json';

const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];


global.gConfig = environmentConfig;

console.log(`global.gConfig: ${JSON.stringify(global.gConfig, undefined, global.gConfig.json_indentation)}`);

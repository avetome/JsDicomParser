var config = {
    build: {
        js: 'dist/',
        jsfile: "jsDicomParser.js",
    },
    
    src: {
        ts: './src/**/*.ts',        
    },
    
    watch: {
        ts: 'src/**/*.ts',
    },
    
    clean: './dist',

    localServer: {
        host: 'localhost',
        port: '9000'
    }
};

module.exports = config;
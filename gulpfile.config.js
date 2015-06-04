var config = {
    build: {
        js: 'dist/',
        dicomParserJsFile: "jsDicomParser.js",
    },
    
    src: {
        dicomParserTs: './src/JsDicomParser/**/*.ts',
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
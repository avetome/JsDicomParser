var config = {
    build: {
        js: 'dist/',
        dicomParserJsFile: "jsDicomParser.js",
        dicomImagingJsFile: "jsDicomImaging.js",
    },
    
    src: {
        dicomParserTs: './src/JsDicomParser/**/*.ts',
        dicomImagingTs: './src/JsDicomImaging/**/*.ts',
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
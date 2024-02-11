function createSessionConfig(){
    return {
        secret: 'super-secret',
        resave: false,
        saveUninitialized: false,
        cookie:{
            secure: false, //개발하는동안엔 false
            maxAge: 2*24*60*60*1000,
        }
    };
}

module.exports = createSessionConfig;
module.exports = {
    loadConfig: function () {
        const config = {
            mongoUri: process.env.MONGO_URI,
            port: process.env.PORT || 9000
        }
        
        return config;
    }
}
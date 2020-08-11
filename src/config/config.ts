export default {
    swagger: {
        options: {
            info: {
                title: 'API Documentation',
                version: 'v1.0.0',
                contact: {
                    name: 'Subrat kumar gantayat',
                    email: 'subratgantayat@gmail.com'
                }
            },
            grouping: 'tags',
            sortEndpoints: 'ordered',
            securityDefinitions: {
                jwt: {
                    type: 'apiKey',
                    description: 'JWT Token',
                    name: 'authorization',
                    in: 'header'
                }
            },
            security: [{ jwt: [] }]
        }
    },
    database: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 27017,
        name: process.env.DB_DATABASE || 'mosohaya',
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    },
    databaseOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        serverSelectionTimeoutMS: 10000,
        poolSize: 10,
        socketTimeoutMS: 30000,
        keepAlive: true,
        keepAliveInitialDelay: 300000,
        connectTimeoutMS: 120000
    },
    appVersion:{
        softWorker:'1.0.1',
        hardWorker:'1.0.1'
    },
    sortOrder:['asc','desc'],
    defaultSortOrder:'asc',
    defaultProjectApplicationStatus:'applied',
    failAction: 'log',
    captchaScore: 0.4
};

import Logger from './helper/logger';
import Server from './server';

// listen on SIGINT signal and gracefully stop the server
process.on('SIGINT', () => {
    Logger.info('Stopping hapi server');
    if (Server.instance()) {
        Server.stop().then((err) => {
            Logger.info(`Server stopped`);
            process.exit(err ? 1 : 0);
        });
    } else {
        process.exit(1);
    }
});

(async () => {
    await Server.start();
})();

import Logger from './helper/logger';
import Server from './server';
import ValidateEnv from '@efstajas/validate-env';

// listen on SIGINT signal and gracefully stop the server
process.on('SIGINT', async () => {
    Logger.info('Stopping hapi server');
    if (Server.instance()) {
        try{
            await Server.stop();
            Logger.info(`Server stopped`);
            process.exit( 0);
        } catch(err){
            process.exit(1);
        }
    } else {
        process.exit(1);
    }
});

process.on('uncaughtException', err => {
    Logger.error('Unhandled error: ', err);
    process.exit(1);
});

(async () => {
    try {
        if(process.env.NODE_ENV !== 'development'){
            const r: any = await ValidateEnv('./.env.template', { silent: true });
            if (r.result === 'fail') {
                const { failedVar } = r;
                const { name, expectedType } = failedVar;
                switch (failedVar.reason) {
                    case 'MISSING':
                        Logger.error(
                            `Variable ${name} is missing from environment variable. Expected type: ${expectedType}`
                        );
                        break;
                    case 'WRONG_TYPE':
                        Logger.error(
                            `Variable ${name} isn't of expected type ${expectedType}.`
                        );
                        break;
                }
                return;
            }
        }
        await Server.start();
    } catch (err) {
        Logger.error('Error while starting server: ', err);
        process.exit(1);
    }
})();

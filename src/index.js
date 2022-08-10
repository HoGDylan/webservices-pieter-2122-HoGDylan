const config = require('config');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const koaCors = require('@koa/cors');
const { initializeLogger, getLogger } = require('./core/logging');
const { initializeData } = require('./data');
const installRest = require('./rest');

const PORT = config.get('port');
const HOST = config.get('host')
const NODE_ENV = config.get('env');
const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');

async function main(){

    initializeLogger({
        level: LOG_LEVEL,
        disabled: LOG_DISABLED,
        isProduction: NODE_ENV === 'production',
        defaultMeta: { NODE_ENV },
    });
    const logger = getLogger();
    
    await initializeData();
    
    const app = new Koa();
    
    app.use(
        koaCors({
            origin: (ctx) => {
                if(CORS_ORIGINS.indexOf(ctx.request.header.origin) != -1){
                return ctx.request.header.origin;
            }
            return CORS_ORIGINS[0];
        },
        allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
        maxAge: CORS_MAX_AGE,
    })
    );
    
app.use(bodyParser());

installRest(app);

app.listen(PORT);

logger.info(`Server listening on http://${HOST}:${PORT}`)
}
main();
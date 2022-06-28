const config = require('config');
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const koaCors = require('@koa/cors');
const { getLogger } = require('./core/logging');
const characterService = require('./service/characters');

const PORT = config.get('port');
const HOST = config.get('host')
const NODE_ENV = config.get('env');
const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');

console.log(`NODE_ENV = ${NODE_ENV}`)
console.log(`log level = ${LOG_LEVEL}, log disabled = ${LOG_DISABLED}`);

const app = new Koa();
const logger = getLogger();

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

const router = new Router();

router.get('/api/characters', async (ctx) => {
    ctx.body = await characterService.getAll();
});

router.post('/api/characters', async (ctx) => {
    const newCharacter = await characterService.create({
        ...ctx.request.body,
        date: new Date(ctx.request.body.date)
    });
    ctx.body = newCharacter;
});

router.get('/api/characters/:id', async (ctx) => {
    ctx.body = await characterService.getById(ctx.params.id);
});

router.put('/api/characters/:id', async (ctx) => {
    ctx.body = await characterService.updateById(ctx.params.id, ctx.request.body);
});

router.delete('/api/characters/:id', async (ctx) => {
    ctx.body = await characterService.deleteById(ctx.params.id);
    ctx.status = 204;
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT);

logger.info(`Server listening on http://${HOST}:${PORT}`)
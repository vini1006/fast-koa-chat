const Koa = require('koa');
const route = require('koa-route');
const Pug = require('koa-pug');
const serve = require('koa-static');

const path = require('path');
const websockify = require('koa-websocket');
const mount = require('koa-mount')

const app = websockify(new Koa());

new Pug({
    viewPath: path.resolve(__dirname, './views'),
    app: app,
});

app.use(mount('/public', serve('src/public')))

app.use(async (ctx, next) => {
    await ctx.render('main')
});

// Using routes
app.ws.use(route.all('/ws', (ctx) => {
  ctx.websocket.on('message', (data) => {
    if (typeof data !== 'string') return;

    const { message, nickName } = JSON.parse(data)

    const { server } = app.ws;

    if ( !server ) return;

    server.clients.forEach((client) => {
        client.send(JSON.stringify({
            message,
            nickName
        }))
    });
    
  });
}));
 
app.listen(5000);

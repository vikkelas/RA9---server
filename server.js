const http = require('http');
const {
   nanoid
} = require('nanoid');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');

const app = new Koa();

app.use(cors());
app.use(koaBody({
   multipart: true,
   json: true,
   urlencoded: true
}));

let posts = [{
      id: 'asdfw423123j4543',
      name: 'Ivanov',
      content: 'тут отображается сообщение пользователя в карточке',
      created: 1653302491323
   },
   {
      id: 'asdasd3w3423er2',
      name: 'Petrov',
      content: 'тут отображается сообщение второго пользователя в карточке',
      created: 1653303492100
   }
];

const router = new Router();

router.get('/posts', async (ctx, next) => {
   const {
      id
   } = ctx.request.query;
   if (id !== undefined && posts.length !== 0) {
      const index = posts.findIndex(item => item.id == id);
      return (ctx.response.body = posts[index]);
   };
   ctx.response.body = posts;
});

router.post('/posts', async (ctx, next) => {
   const {
      name,
      content
   } = ctx.request.body;

   posts.push({
      content: content,
      name: name,
      id: nanoid(),
      created: Date.now(),
   });
   ctx.response.status = 204;
});

router.put('/posts/:id', async (ctx, next) => {
   const postId = ctx.params.id;
   const postChangeContent = ctx.request.body.content;
   const index = posts.findIndex(o => o.id === postId);
   posts[index].content = postChangeContent;
})

router.delete('/posts/:id', async (ctx, next) => {
   const postId = ctx.params.id;
   const index = posts.findIndex(o => o.id === postId);
   if (index !== -1) {
      posts.splice(index, 1);
   }
   ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('server started'));
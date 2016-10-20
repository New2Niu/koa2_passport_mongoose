import Koa from 'koa';
import connectDB from './db';
import addMiddlewares from './middlewares';
const app = new Koa()
// trust proxy
app.proxy = true
// MongoDB
connectDB(()=>{

  //middlewares
  addMiddlewares(app);
  // start server
  const port = process.env.PORT || 3000
  app.listen(port, () => console.log('Server listening on', port))
})



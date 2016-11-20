/*
* @Author: Administrator
* @Date:   2016-10-19 13:17:42
* @Last Modified by:   Administrator
* @Last Modified time: 2016-10-20 15:19:06
*/

'use strict';
import convert from 'koa-convert';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import authCfg from './auth/authCfg';
import {anon,authc,authenticate} from './auth/auth';
import passport from 'koa-passport';
import KoaRouter from 'koa-router';
import path from 'path';
import fs from 'fs';
import addController from './addController';
import koaCors from 'koa-cors';
import CSRF from 'koa-csrf';
import koaStatic from 'koa-static';
import history from 'koa-connect-history-api-fallback';

export default (app)=>{
    
  // sessions
  app.keys = ['your-session-secret', 'another-session-secret']

  const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    maxAge: 2000, /** (number) maxAge in ms (default is 1 days) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
  };
  app.use(convert(session(CONFIG,app)))
  // body parser
  app.use(bodyParser());

  // csrf
  //app.use(new CSRF());
  
  //cors
  const cors = convert(koaCors({
    maxAge: 7 * 24 * 60 * 60,// 7 days 预请求头有效期
    //credentials: true,//允许发送cookie
    methods: 'GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE',
    headers: 'Content-Type, Accept, Authorization'
  }));
  app.use(cors);

  //static
  app.use(convert(koaStatic(path.join(__dirname,'../../public'))));

  // authentication
  authCfg(passport);
  app.use(passport.initialize());
  app.use(passport.session());

  // Require authentication for now
  //app.use(authenticate(passport));
  app.use(anon);
  app.use(authc(passport));
  
  //routes
  const router = new KoaRouter();
  addController(router,path.join(__dirname,'../controllers/'));
  app.use(router.routes());

  //api fallback  处理router未匹配的路由
  app.use(async (ctx,next)=>{
    ctx.type='html';
    ctx.body=fs.createReadStream(path.join(__dirname,'../../public/dist/index.html'));
  })
}
/*
* @Author: Administrator
* @Date:   2016-10-19 13:17:42
* @Last Modified by:   Administrator
* @Last Modified time: 2016-10-19 19:04:54
*/

'use strict';
import convert from 'koa-convert';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import authCfg from './auth/authCfg';
import authenticate from './auth/authenticate';
import passport from 'koa-passport';
import KoaRouter from 'koa-router';
import path from 'path';
import addController from './addController';
import koaCors from 'koa-cors';

export default (app)=>{
  // sessions
  app.keys = ['your-session-secret', 'another-session-secret']
  app.use(convert(session(app)))
  // body parser
  app.use(bodyParser())
  //cors
  const cors = convert(koaCors({
    maxAge: 7 * 24 * 60 * 60,// 7 days 预请求头有效期
    credentials: true,
    methods: 'GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE',
    headers: 'Content-Type, Accept, Authorization'
  }));
  app.use(cors);
  // authentication
  authCfg(passport);
  app.use(passport.initialize());
  app.use(passport.session());

  // Require authentication for now
  app.use(authenticate(passport));
  //routes
  const router = new KoaRouter();
  addController(router,path.join(__dirname,'../controllers/'));
  app.use(router.routes())
}
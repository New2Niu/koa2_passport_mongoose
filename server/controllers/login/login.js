/*
* @Author: Administrator
* @Date:   2016-10-02 23:38:27
* @Last Modified by:   Administrator
* @Last Modified time: 2016-10-20 14:50:28
*/

'use strict';
import passport from 'koa-passport';
const index = async (ctx,next)=>{
	ctx.body=`
		<form action='/login' method='POST'>
			<input type="hidden" name="_csrf" value="${ctx.csrf}" />
			<label for='username'>用户名:</label>
			<input id='username' type='text' name='username'/>
			<label for='password'>密码:</label>
			<input id='password' type='password' name='password'/>
			<button type='submit'>提交</button>
		</form>
		<a href='/auth/github'>login by github</a>
	`
}


const app = async (ctx,next)=>{
	ctx.body=`
		<h1>App</h1>
  		<p>You are authenticated ... <a href="/logout">logout</a></p>
	`
}


const logout = async (ctx,next)=>{
	ctx.logout()
  	ctx.redirect('/')
}

export default {
	'GET /':index,
	'GET /app':app,
	'GET /logout':logout
}

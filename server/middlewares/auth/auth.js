/*
* @Author: Administrator
* @Date:   2016-10-19 13:34:54
* @Last Modified by:   Administrator
* @Last Modified time: 2016-10-19 19:11:11
*/

'use strict';

/*-----------------配置 start-------------------*/
//登陆url
const LOGIN_URL = '/logini';
//登陆成功后重定向的url
const SUCCESS_REDIRECT = '/home';
//登陆失败后重定向的url
const FAILURE_REDIRECT ='/logini';
//////////////////////////////////
/// "/**"表示匹配多有url
//匿名url
const ANON_URL=[];
//身份验证url
const AUTHC_URL = ['/**'];
/*-----------------配置 end-----------------*/


//@匹配url
//@arrPath array
//@path  
//@ctx
//@return true arrPath中匹配path; 否则false
const pathMatch = (arrPath,path,ctx)=>{
	if(arrPath.includes(path)||arrPath.includes('/**')){
		ctx.isUrlMatch = true;
		return true;
	}else{
		return false;
	}
}

////////
///注意顺序,前面匹配成功后面不在匹配
////////

/*------------------anon start----------------------*/
const anon = async (ctx,next)=>{
	//请求的path  例如:/login
	let path = ctx.path;
	if(!ctx.isUrlMatch && pathMatch(ANON_URL,path,ctx)){//匹配url
		await next();
	}else{
		await next();
	}
}
/*----------------anon start--------------------*/

/*----------------authc start-------------------*/
const authc = (passport)=>{
	return async (ctx,next)=>{
		let path = ctx.path;
		if(!ctx.isUrlMatch && pathMatch(AUTHC_URL,path,ctx)){//url匹配成功
			if(ctx.isAuthenticated()){//若已登录
				await next();
			}else{//未登录
				if(path===LOGIN_URL){//login 登陆请求
					if (ctx.method==='POST'){//login post
						await execLogin(ctx,next,passport);
					}else{//login get
						await next();
					}
				}else{//非登陆请求
					ctx.redirect(LOGIN_URL);
				}
			}
		}else{//url未匹配
			await next();
		}
	}
}
//登陆验证
const execLogin = async (ctx,next,passport)=>{
	await passport.authenticate('local', {
		    successRedirect: SUCCESS_REDIRECT,
		    failureRedirect: FAILURE_REDIRECT
		  })(ctx,next);
}
/*------------------authc start------------------*/



const authenticate = (passport)=>{
	return async (ctx, next)=>{
		switch(ctx.path){
			case '/':
				await next();
				break;
			case '/login':
				await passport.authenticate('local', {
				    successRedirect: '/home',
				    failureRedirect: '/'
				  })(ctx,next);
				  break;
			//github auth --start--
			case '/auth/github':
				await passport.authenticate('github')(ctx,next);
				break;
			case '/auth/github/callback':
				await passport.authenticate('github', {
				    successRedirect: '/home',
				    failureRedirect: '/'
				 })(ctx,next);
				break;
			//github auth --end--
			default:
				console.log(ctx.path,ctx.req.user)

				if (ctx.isAuthenticated()) {
					console.log('aut')
			      await next()
			    } else {
			    	console.log('red')
			      ctx.redirect('/')
			    }
			    break;
		}
	}
}

 export  {anon,authc,authenticate};
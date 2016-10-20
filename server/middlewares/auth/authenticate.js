/*
* @Author: Administrator
* @Date:   2016-10-19 13:34:54
* @Last Modified by:   Administrator
* @Last Modified time: 2016-10-19 19:11:11
*/

'use strict';

const authenticate = (passport)=>{
	return async (ctx, next)=>{
		switch(ctx.path){
			case '/':
				await next();
				break;
			case '/login':
				await passport.authenticate('local', {
				    successRedirect: '/app',
				    failureRedirect: '/'
				  })(ctx,next);
				  break;
			//github auth --start--
			case '/auth/github':
				await passport.authenticate('github')(ctx,next);
				break;
			case '/auth/github/callback':
				await passport.authenticate('github', {
				    successRedirect: '/app',
				    failureRedirect: '/'
				 })(ctx,next);
				break;
			//github auth --end--
			default:
				if (ctx.isAuthenticated()) {
			      await next()
			    } else {
			      ctx.redirect('/')
			    }
			    break;
		}
	}
}

 export default authenticate;
/*
* @Author: Administrator
* @Date:   2016-10-19 11:14:36
* @Last Modified by:   Administrator
* @Last Modified time: 2016-10-19 13:16:43
* @function:连接数据库
*/

'use strict';
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
const connectDB = (callbasck)=>{
	mongoose.connect('mongodb://127.0.0.1:27017/testdb');
	let db = mongoose.connection;
	db.on('error',(err)=>{
		console.log('connect error:',err);
	});
	db.once('open',()=>{
		console.log('connected mongodb success!');
		callbasck();
	})
}

export default connectDB;
/*
* @Author: Administrator
* @Date:   2016-10-02 23:43:27
* @Last Modified by:   Administrator
* @Last Modified time: 2016-10-19 14:01:26
* @function:加载route
*/

'use strict';
import fs from 'fs';
import path from 'path';

const addMapping = (router,ctrlMap)=>{
	Object.keys(ctrlMap).forEach((key)=>{
		const method = key.split(' ')[0].toUpperCase(),
			  url = key.split(' ')[1];
		switch(method){
			case 'GET':
				router.get(url,ctrlMap[key]);
				break;
			case 'POST':
				router.post(url,ctrlMap[key]);
				break;
			case 'PUT':
				router.put(url,ctrlMap[key]);
				break;
			case 'DELETE':
				router.delete(url,ctrlMap[key]);
				break;
			default:
				break;
		}
		
	})
}
//只加载一次可以用同步
const addController=(router,dirpath)=>{
	let files = fs.readdirSync(dirpath);
	files.forEach(file=>{
		let pathname  = path.join(dirpath,file);
		let stat = fs.statSync(pathname);
		if (stat.isDirectory()) {
			addController(router,pathname);
		}else{
			if(file.endsWith('.js')){
				let ctrlMap = require(pathname).default;
				addMapping(router,ctrlMap);
			}
		}
	})
}

export default addController;

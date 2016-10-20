/*
* @Author: Administrator
* @Date:   2016-10-19 10:15:14
* @Last Modified by:   Administrator
* @Last Modified time: 2016-10-19 10:23:48
*/

'use strict';

const register = require('babel-core/register');//不会对当前文件转码

register({
	presets:['stage-3','es2015']
});

require('babel-polyfill');
require('./server/app');
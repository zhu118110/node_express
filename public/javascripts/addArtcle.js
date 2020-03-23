// 连接数据库中名为add的集合, 

var express=require("express");
var router=express.Router();
var model=require("./db.js");
var schema=new model.Schema({
	title:String,
	writer:{
		type:String,
		default:"么感情的程序猿"
	},
	kind:String,
	content:String,
	date:String,
	reading:{
		type:Number,
		default:0
	},
	readingDate:{
		type:String,
		default:""
	}
	
});
var addmodel=model.model("add",schema,"add");
module.exports=addmodel;

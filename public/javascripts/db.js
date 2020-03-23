// 连接服务器
var express=require("express");
var mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/boke",{ useNewUrlParser: true,useUnifiedTopology: true },function(err){
	if(err){
		 throw err;
	}else{
		console.log("数据库连接成功");
	}
})
module.exports=mongoose;
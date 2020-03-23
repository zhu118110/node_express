var express=require("express");
var router=express.Router();
var model=require("./db.js");


var schema=new model.Schema({
	"readDate":String,   //查看时间
    "readSum":{
        type:Number,
        default:0
    },    //查看数
    "articleId":String   //文章ID
});
var pandectModel=model.model("pandect",schema,"pandect");
module.exports=pandectModel;
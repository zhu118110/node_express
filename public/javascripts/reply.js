// 回复的评论
var express=require("express");
var router=express.Router();
var model=require("./db.js");


var schema=new model.Schema({
    isReply:{
        type:Boolean,
        default:false
    },
    cmtContent:String,   //评论内容
    cmtDate:String,    //评论时间
    title:String,
    titleId:String,   //回复的标题Id
    replyContent:String,   //回复的内容
    commentId:String,  //回复的评论的Id
    replyTime:String,  //回复时间
    writer:String,   //回复的作者
    isWriter:{
        type:Boolean,
        default:true
    },
    kind:String
})
var reply=model.model("reply",schema,"reply");
module.exports=reply;
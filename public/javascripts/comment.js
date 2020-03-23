// 创建评论的model
var express=require("express");
var router=express.Router();
var model=require("./db.js");


var schema=new model.Schema({
    titleId:String,  //文章ID
    title:String,   //文章标题
    timeStr:String,  //评论时间
    writer:String,   //作者
    content:{   //内容
        type:String,
    },
    kind:String,   //文章种类
    //是否让此评论显示在页面上
    isShow:{         
        type:Boolean,
        default:true,
    }, 
     //是否回复了评论
    reply:{ 
        type:Boolean,
        default:false,
    },
    replyTime:{
        type:String,
    },
    // 评论的内容
    replyMsg:{
        type:String,
        default:""
    }
})
var comment=model.model("comment",schema,"comment");
module.exports=comment;

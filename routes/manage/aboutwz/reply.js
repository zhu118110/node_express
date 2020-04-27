var express=require("express");
var router=express.Router();
var fs=require("fs");
var replyModel=require("../../../public/javascripts/reply");   //回复评论的model
var cmdModel=require("../../../public/javascripts/comment");  //评论的model
// 跨域
router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// 获取到回复的内容放到reply数据库

router.get("/getReply",function(req,res){
    let replyMsg=req.query;
    let enity=new replyModel({
        titleId:replyMsg.titleId,  //标题id
        content:replyMsg.replyMsg,  //回复内容
        commentId:replyMsg.commentId,  //评论id
        replyTime:replyMsg.dateStr,  //回复时间
        writer:replyMsg.writer,  //作者
    })
    
    enity.save(function(err){
        if(err) throw err;
        // 根据评论Id改变回复状态, 
        cmdModel.findByIdAndUpdate(enity.commentId,{$set:{"reply":true}},function(err,data){
            if(err) throw err;
            res.send("1");
        })
        
    })
})

// 是否显示回复信息
router.get("/isShow",function(req,res){
    let show=req.query.isShow;
    let id=req.query.id;
    let Showenity=new cmdModel({
        isShow:show,
    })
    cmdModel.findByIdAndUpdate(id,{ $set:{ "isShow":Showenity.isShow } },function(err,data){
        if(err) throw err;
        res.send("1")
    })
   
    
})



// 功能: 在评论表里查找已经回复过的评论,查找条件是 "reply"=true ;
// 变量: 无;
// 思路: 前端请求这个接口时,去评论表中查找符合条件是 "reply"=true 的字段得到data,并将data返回给前端,返回的是一个数组;
// router.get("/replyPl",function(req,res){
//     cmdModel.find( {"reply":true},function(err,data){
//         if(err) throw err;
//         res.send(data);
//     } );
// })

router.get("/replyPl/:page/:totle",function(req,res){
    let replyBox=[];
    let page=req.params.page;   //前端传递的当前显示的第几页
	let totle=req.params.totle;  //每页显示多少条数据
	let pageData;
    cmdModel.find( {"reply":true},function(err,doc){
        
        if(err){
            res.json({
                data:"0"
            })
        }else if(doc.length>0){
            for(let i in doc){
                replyModel.find({"commentId":doc[i]._id},function(err,result){
                    if(err){
                        res.json({
                            data:"0"
                        })
                    }else if(result.length>0){
                        doc[i].replyMsg=result[0].content;
                        doc[i].replyTime=result[0].replyTime;
                        if(doc.length==parseInt(i)+1 ){
                            pageData=result.slice( (page-1)*totle,page*totle );
                            res.json({
                                data:doc,
                                row:doc.length,
                                totlePages:Math.ceil(doc.length/totle)
                            });
                           
                        }
                    }
                    
                })
            }
        }
        else{
            res.send("0");
        }
        
    } );
})


router.get("/noReply/:page/:totle",function(req,res){
    let replyBox=[];
    let page=req.params.page;   //前端传递的当前显示的第几页
	let totle=req.params.totle;  //每页显示多少条数据
	let pageData;
    cmdModel.find( {"reply":false},function(err,doc){
        if(err){
			res.json({
                data:"0"
            })
		};
		// 设置显示多少条数据  
		pageData=doc.slice( (page-1)*totle,page*totle );
		
		res.json({
			data:pageData,
			row:doc.length,
			totlePages:Math.ceil(doc.length/totle)
		});
    } );
})
module.exports=router;
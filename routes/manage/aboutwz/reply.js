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

router.post("/getReply",function(req,res){
    let replyMsg=req.body;
    
    let enity=new replyModel({
        isReply:replyMsg.isReply, 
        cmtContent:replyMsg.cmtContent,   //评论的内容
        cmtDate:replyMsg.cmtDate,    //评论的时间
        title:replyMsg.title,  
        titleId:replyMsg.titleId,  //标题id
        replyContent:replyMsg.replyMsg,  //回复内容
        commentId:replyMsg.commentId,  //评论id
        replyTime:replyMsg.replyDate,  //回复时间
        writer:replyMsg.writer,  //作者
        kind:replyMsg.kind
    })
   
    enity.save(function(err){
        if(err) throw err;
        // 根据评论Id改变回复状态, 
        cmdModel.findByIdAndUpdate(enity.commentId,{$set:{"reply":true}},function(err,data){
            if(err){
                res.json({
                    statu:"error",
                    data:[]
                });
            }else{
                res.json({
                    statu:"success",
                    data:[]
                });
            }
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

// 进入已回复页面获取已回复过的评论
// 先在评论表里根据reply=true字段找到所有被回复过的评论，
// 然后根据回复过的评论id去回复表里查找对应的内容
router.get("/replyPl/:page/:totle",function(req,res){
    let page=req.params.page;   //前端传递的当前显示的第几页
    let totle=req.params.totle;  //每页显示多少条数据
    let pageData;

    function selectCmd(){
        let cmd=new Promise((resolve,reject)=>{
            // 根据字段查找已经被回复过的评论
            cmdModel.find({"reply":true},function(err,cmdData){
                if(err){
                    reject("评论表查找失败")
                    
                }else{
                    if(cmdData.length<=0){
                        res.json({
                            statu:"success",
                            data:[],
                            row:1,
                            totlePages:totle,
                        })
                        return false
                    }else{
                        console.log("我是评论字段"+cmdData)
                        resolve(cmdData)
                    }
                   
                }
            })
        })
        return cmd;
    }
    
    function selectReply(cmdId){
        let resultBox=[];
        cmdId.forEach((val,i,cmdId)=>{
            // 根据评论的id去回复表里查找内容
            replyModel.find({"commentId":val._id},function(err,result){
                if(err){
                    res.json({
                        statu:"error",
                    })
                }else if(result.length>0){
                    resultBox=resultBox.concat(result)
                   
                   if(Number(i)+1==cmdId.length){
                        pageData=resultBox.slice( (page-1)*totle,page*totle);
                        res.json({
                            statu:"success",
                            data:pageData,
                            row:resultBox.length,
                            totlePages:Math.ceil(resultBox.length/totle)
                        })
                   } 
                }else{
                    res.json({
                        statu:"success",
                        data:[],
                        row:1,
                        totlePages:totle
                    })
                }
            })
        })
       
    }

    selectCmd()
    .then(data=>{
        return selectReply(data)
    })
    .catch(err=>{
        res.json({
            statu:"error",

        })
    })

  
})





// 获取没有回复过的评论
router.get("/noReply/:page/:totle",function(req,res){
    let replyBox=[];
    let page=req.params.page;   //前端传递的当前显示的第几页
	let totle=req.params.totle;  //每页显示多少条数据
	let pageData;
    // 根据字段查找已经被回复过的评论
    cmdModel.find({"reply":false},function(err,cmdData){
        if(err){
            res.json({
                statu:"error"
            })
            
        }else{
            pageData=cmdData.slice( (page-1)*totle,page*totle );
            res.json({
                statu:"success",
                data:cmdData,
                row:cmdData.length,
                totlePages:pageData
            })
        }
    })
       
    
   

    
})
module.exports=router;
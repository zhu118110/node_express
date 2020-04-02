//  从数据表comment中获取发表的评论
var express=require("express");
var router=express.Router();
var replyModel=require("../public/javascripts/reply");
var cmdModel=require("../public/javascripts/comment");  //发表评论的model

router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// 发表评论
router.get("/pl",function(req,res){
    let data=req.query;
    let enity=new cmdModel({
        titleId:data.titleId,
        title:data.title,
        timeStr:data.time,
        writer:data.writer,
        content:data.content,
        kind:data.kind,
    })
    enity.save(function(err){
        if(err) throw err
        res.send("1");
    })
})

// 获取评论
router.get("/getpl",function(req,res){
    cmdModel.find({},function(err,data){
        if(err) throw err;
        res.send(data);
    })
})



// 功能:后台 '所有评论' 页选中评论后点击删除删除评论,
// 变量:
    //@  idArr 接收前端发送的选中的评论的id,类型是数组,
    //@  scss  存放删除成功后返回的对象信息,类型是数组
// 思路:
    // 1.先判断前端是否发送了至少一条数据;    idArr.length>0
    // 2.遍历 idArr ,根据id去评论库查找对应的内容data,它是一个数组
    // 3.遍历 data ,进行删除,删除成功后返回的对象放到 scss 数组中
    // 4.比较 scss 和 idArr 数组的长度,如果长度相同则表示全部删除,给前端返回状态码1;
router.get("/delpl",function(req,res){
    
    let idArr=req.query.idArr;
    let cmdData=[];  //评论的数据

    for(var i=0;i<idArr.length;i++){
        cmdModel.findByIdAndRemove({"_id":idArr[i]},function(err,data){
            if(err){
                throw err
            }else{
                // 保存删除的评论
                cmdData.push(data);
                // 如果已经删除掉的评论数量==选中的评论数量,给前端返回1
                if(cmdData.length==idArr.length){
                    res.send("1");
                }      
            }
        })
    }
})

// 删除回复
router.get("/delhf",function(req,res){
    let idArr=req.query.idArr;
    let replyData=[];  //回复的数据
    let dataLength=0;
    for(let i in idArr){
        replyModel.find({"commentId":idArr[i]},function(err,data){
            
            if(data.length>0){
                dataLength+=data.length;
                if(err){
                    throw err;
                }else{
                    for(let j in data){
                        data[j].remove(function(err,success){
                            replyData.push(success);
                            if(dataLength==replyData.length){
                                res.send("1")
                            }
                        })
                    }
                    
                }
            }else{
                res.send("0")
            }
            
        })
    }
   
    
})


module.exports=router;
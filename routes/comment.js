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
router.get("/getpl/:page/:totle",function(req,res){
    let page=req.params.page;   //前端传递的当前显示的第几页
	let totle=req.params.totle;  //每页显示多少条数据
    let pageData;
	// @row :一共有多少条文章
	// @totlePages：总共有几页      总页数=所有文章数量/每页显示的数据
	// @data:要显示的数据
    cmdModel.find({},function(err,doc){
        if(err){
            res.json({
                statu:"error",
            })
        }else{
            pageData=doc.slice( (page-1)*totle,page*totle );
            res.json({
                statu:"success",
                data:pageData,
                row:doc.length,
                totlePages:Math.ceil(doc.length/totle)
            });
        }
    })
})



// 功能:后台 '所有评论' 页选中评论后点击删除删除评论,
// 变量:
    //@  idArr 接收前端发送的选中的评论的id,类型是数组,
    //@  scss  存放删除成功后返回的对象信息,类型是数组

router.post("/delpl",function(req,res){
    // 接收前端发送的id，它是个json，先解码
    let idArr=JSON.parse(req.body.idArr);
    var ok=0;
    // 根据请求的id，去评论表里通过id查找到字段进行删除
    function removeComent(ids){
      
        let removeComt=new Promise((resolve,reject)=>{
            ids.forEach((val,i,arr)=>{
              
                cmdModel.remove({"_id":val},function(err,data){
                    if(err){
                        reject("评论表字段查找失败"+err)
                    }else{
                        ok+=Number(data.ok);
                        if(ok==Number(i)){
                            resolve(arr);
                        }
                    }
                })
            })
        })
        return removeComt;
    }

    // 回复表里根据请求的评论的id进行删除
    function removeReply(ids){
        let removeReply=new Promise((resolve,reject)=>{
            ids.forEach((val,i,arr)=>{
                // 先根据评论id找到对应的回复的字段
                replyModel.find({"commentId":val},function(err,data){
                   data.forEach((removeVal,removeI,removeData)=>{
                        //删除对应的回复的字段    
                        removeVal.remove((err,removeData)=>{
                            if(data.lenth==removeData.length){
                                resolve(1);
                            }
                        })
                   })
                })
            })
        })
        return removeReply;
    }

    removeComent(idArr)
    .then(data=>{
        return removeReply(data);
    })
    .then(data=>{
       if(data){
           res.json({
               statu:"success",
           })
       }
    })
    .catch(err=>{
        res.json({
            statu:"error"+err,
            
        })
    })

})









module.exports=router;
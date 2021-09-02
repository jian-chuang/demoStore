let dbquery = require('../moduleMysql/mysql.js')

let  sortController = {}

// 分类页面
sortController.sortIndex = (req,res)=>{
    res.render('sortList.html')
}

// 分类数据获取
sortController.sortData = async(req,res)=>{
    let isShow = {
        "0":"不显示",
        "1":"显示"
    }
    let sql = "select * from category"
    let data = await dbquery(sql)
    let sortData = data.map((item)=>{
        item.is_show = isShow[item.is_show]
        return item
    })
    res.json(sortData)
}

// 分类删除
sortController.delData = async (req,res)=>{
    let {cate_id} = req.body;
    let sql = `delete from category where cate_id = '${cate_id}'`
    let result = await dbquery(sql)
    if(result.affectedRows){
        res.json({code:10014,message:'删除成功'})
    }else{
        res.json({code:10013,message:'删除失败'})
    }
}

// 分类添加
sortController.addSort = (req,res)=>{
    res.render('add_sort.html')
}
// 数据添加入库
sortController.insertSort = async (req,res)=>{
    let {title,is_show,addtime} = req.body
    let sql1 = `select * from category where cate_name = '${title}'`;
    let data = await dbquery(sql1)
    if(data.length > 0){
        res.json({code:10010,message:'该分类已占用'})
    }else{
        let sql2 = `insert into category(cate_name,is_show,add_date,update_date)values("${title}","${is_show}","${addtime}","${addtime}")`;
        let result = await dbquery(sql2)
        if(result.affectedRows){
            res.json({code:10012,message:"添加成功"})
        }else{
            res.json({code:10011,message:"系统繁忙，稍后重试"})
        }
    }
}

// 分类编辑
sortController.editSort = async(req,res)=>{
    let {cate_id} = req.query
    let sql = `select * from category where cate_id = ${cate_id}`
    let data = await dbquery(sql)
    res.render('edit_sort.html',{sortData:data[0]})
}

// 更新入库
sortController.updateSort = async (req,res)=>{
    let {cate_id,title,is_show,addtime} = req.body;
    let sql = `select cate_id from category where cate_name = "${title}" and cate_id != ${cate_id}`;
    let data = await dbquery(sql)
    if(data.length > 0 ){
        res.json({code:10016,message:'分类名已占用'})
        return
    }
    let sql2 = `update category set cate_name = "${title}",is_show = "${is_show}",update_date = "${addtime}" where cate_id = ${cate_id}`
    let result = await dbquery(sql2);
    if(result.affectedRows){
        res.json({code:10018,message:'编辑成功'})
    }else{
        res.json({code:10019,message:'系统繁忙，请稍后重试'})
    }
}
module.exports = sortController
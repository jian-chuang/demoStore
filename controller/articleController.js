const path = require('path')
const fs = require('fs')
let dbquery = require('../moduleMysql/mysql.js')
let articleController = {}

//首页
articleController.indexPage = (req, res) => {
    res.render('index.html')
}

// 文章列表
articleController.listPage = async (req, res) => {
    res.render('article_list.html')
}

// // 文章数据加载
// articleController.getData = async (req, res) => {
//     // 文章状态对象映射
//     let articleStatus = {
//         "0": `<span>待审核</span>`,
//         "1": `<span >审核通过</span>`,
//         "2": `<span>审核失败</span>`,
//     }
//     let sql = `select ti.*,t2.cate_name from articlelist ti left join category t2 on ti.sort = t2.cate_id
//        where ti.pub_status = 1 and ti.is_delete = 0 order by art_id desc;`
//     let data = await dbquery(sql)
//     data = data.map((item) => {
//         item.pub_status = articleStatus[item.pub_status]
//         return item
//     })
//     res.json(data)
// }
// articleController.getData = async (req,res)=>{
//     let {curr,limit} = req.query;
//     let offset = (curr - 1) * limit
//     let sql = `select count(*) as count from articlelist where pub_status = 1 and is_delete = 0`
//     let sql2 = `select ti.*,t2.cate_name from articlelist ti left join category t2 on ti.sort = t2.cate_id
//             where ti.pub_status = 1 and ti.is_delete = 0 order by art_id desc limit ${offset},${limit};`
//     let data = await dbquery(sql)
//     let data2 = await dbquery(sql2)
//     res.json({count:data[0].count,data:data2})
// }


// 添加文章页面
articleController.addPage = async (req, res) => {
    let sql = "select * from category";
    let data = await dbquery(sql)
    res.render('add_article.html', { sortData: data })
}

articleController.addArticle = async (req, res) => {
    let { title, author, sort, content, status, addtime, img } = req.body
    let sql = "insert into articlelist(title,author,sort,content,pub_status,pub_time,img)values(?,?,?,?,?,?,?)";
    let bind = [title, author, sort, content, status, addtime, img]
    let result = await dbquery(sql, bind)
    if (result.affectedRows) {
        res.json({ message: '添加成功', code: 10000 })
    } else {
        res.json({ message: "添加失败", code: 10002 })
    }
}

articleController.uploadImg = (req, res) => {
    let imgPath = ''
    // 判断是否有图片
    if (req.file) {
        let { originalname, filename } = req.file
        let suffix = originalname.substring(originalname.indexOf('.'))
        let oldPath = path.join(__dirname, '../', 'uploads', filename);
        let newPath = path.join(__dirname, '../', 'uploads', filename) + suffix;
        imgPath = `uploads/${filename}${suffix}`
        fs.renameSync(oldPath, newPath, err => {
            if (err) { throw err }
        })
        res.json({ message: '上传成功', code: '10000', 'path': imgPath })
    } else {
        res.json({ message: '没有文件上传' })
    }
}

// 编辑文章页面
articleController.editPage = async (req, res) => {
    let { art_id } = req.body;
    let sql = `select * from articlelist where art_id = ${art_id}`;
    let sql2 = "select * from category";
    let sortData = await dbquery(sql2)
    let data = await dbquery(sql)
    res.render('edit_article.html', { articleData: data[0], sortData })
}

articleController.editArticle = async (req, res) => {
    let { art_id, title, author, sort, content, status, addtime, img } = req.body
    let sql = `update articlelist set title='${title}',author='${author}',sort='${sort}',
    content='${content}',pub_status='${status}',update_time='${addtime}',img='${img}'
    where art_id = ${art_id}`
    let result = await dbquery(sql);
    if (result.affectedRows) {
        res.json({ code: 10004, message: '更新成功' })
    } else {
        res.json({ code: 10005, message: '更新失败' })
    }
}

articleController.uploadedit = (req, res) => {
    let imgPath = ''
    let { fileImg } = req.body
    if (req.file) {
        let { originalname, filename } = req.file
        let suffix = originalname.substring(originalname.indexOf('.'))
        let oldPath = path.join(__dirname, '../', 'uploads', filename);
        let newPath = path.join(__dirname, '../', 'uploads', filename) + suffix;
        imgPath = `uploads/${filename}${suffix}`
        fs.renameSync(oldPath, newPath, err => {
            if (err) { throw err }
        })
        res.json({ message: '上传成功', code: '10000', 'path': imgPath })
    } else {
        res.json({ message: '没有文件上传' })
    }
}

//文章详情
articleController.articleDetail = async (req, res) => {
    let { art_id } = req.query
    let sql = `select * from articlelist where art_id = ${art_id}`
    let data = await dbquery(sql)
    res.json(data[0])
}

// 文章删除
articleController.delArticle = async (req, res) => {
    let { art_id, img } = req.body;
    let sql = `delete from articlelist where art_id=${art_id}`
    let result = await dbquery(sql)
    if (result.affectedRows) {
        if (img) {
            let oldPath = path.join(__dirname, '../', img)
            fs.unlink(oldPath, (err) => {
                // 静默
                if (err) { throw err }
            })
        }
        res.json({ code: 10000, message: '删除成功' })
    } else {
        res.json({ code: 10002, message: '删除失败' })
    }
}

// 动态数据列表
articleController.dynTable = (req,res)=>{
    res.render('article.html')
}

articleController.fetchData = async (req,res)=>{
    let {page,limit:pagesize,keyWord} = req.query
    let where = ''
    if(keyWord){
        where += `and title like '%${keyWord}%'`
    }
    let offset = (page - 1 ) * pagesize
    let sql = `select count(*) as count from articlelist where is_delete = 0 ${where}`
    let sql2 =`select ti.*,t2.cate_name from articlelist ti left join category t2 on ti.sort = t2.cate_id
    where ti.is_delete = 0 ${where} order by art_id desc limit ${offset},${pagesize};`
    let Promise1 = dbquery(sql)
    let Promise2 = dbquery(sql2)
    let result = await Promise.all([Promise1,Promise2])
    let data = result[1]
    let count = result[0][0].count  
    let response = {
        code:0,
        count:count,
        data:data,
    }
    res.json(response)  
}

// 回收站
articleController.recovery = async (req,res)=>{
    let {art_id} = req.body
    let sql = `update articlelist set is_delete = 1 where art_id = ${art_id}`
    let result = await dbquery(sql)
    if(result.affectedRows){
        res.json({code:10024,message:'回收成功'})
    }else{
        res.json({code:10023,message:'回收失败'})
    }
}

module.exports = articleController
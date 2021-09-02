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

// 文章数据加载
articleController.getData = async (req, res) => {
    // 文章状态对象映射
    let articleStatus = {
        "0": `<span>待审核</span>`,
        "1": `<span >审核通过</span>`,
        "2": `<span>审核失败</span>`,
    }
    let sql = `select ti.*,t2.cate_name from articlelist ti left join category t2 on ti.sort = t2.cate_id
       where ti.pub_status = 1 and ti.is_delete = 0 order by art_id desc;`
    let data = await dbquery(sql)
    data = data.map((item) => {
        item.pub_status = articleStatus[item.pub_status]
        return item
    })
    res.json(data)
}

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


module.exports = articleController
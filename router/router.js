const express = require('express')
const path = require('path')
const multer = require('multer')
const router = express.Router()

let userController = require('../controller/userController.js')
let articleController = require('../controller/articleController.js')
let sortController = require('../controller/sortController.js')

// 设置图片上传目录
var upload = multer({ dest: path.join(__dirname, '../','uploads') })

// 用户登录页面
router.get('/login',userController.loginPage)

// 登录请求
router.post('/submit',userController.login)

// 用户退出
router.get('/logout',userController.logout)

// 头像上传
router.post('/uploadImg',upload.single('file'),userController.uploadImg)

// 更新数据库头像
router.post('/updateImg',userController.updateImg)

//首页
router.get('/',articleController.indexPage)

// 文章列表
// router.get('/article_list',articleController.listPage)

// 文章列表数据加载
// router.get('/getArticleData',articleController.getData)

//文章添加操作
router.get('/addPage',articleController.addPage)

router.post('/addArticle',upload.single('file'),articleController.addArticle)

router.post('/cover',upload.single('file'),articleController.uploadImg)

// 文章编辑页面
router.post('/editPage',articleController.editPage)

router.post('/editArticle',upload.single('file'),articleController.editArticle)

router.post('/editImg',upload.single('file'),articleController.uploadedit)

// 文章删除
router.post('/del',articleController.delArticle)

//查看文章内容详情
router.get('/articleDetail',articleController.articleDetail)

// 分类页面
router.get('/article_sort',sortController.sortIndex)

// 获取分类数据
router.get('/sortData',sortController.sortData)

// 分类删除
router.post('/delData',sortController.delData)

// 添加分类
router.get('/addSort',sortController.addSort)

// 添加数据入库
router.post('/insertSort',sortController.insertSort)

// 分类编辑
router.get('/editSort',sortController.editSort)

// 更新数据入库
router.post('/updateSort',sortController.updateSort)


// 动态数据表格
router.get('/dynTable',articleController.dynTable)

router.get('/fetchData',articleController.fetchData)

// 回收站
router.post('/recovery',articleController.recovery)


// 博客路由管理 


module.exports = router
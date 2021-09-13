const express = require('express')
const router = express.Router()
let dbquery = require('../moduleMysql/mysql')


// 分类数据
router.get('/cate',async (req,res)=>{
    let sql = `select * from category`
    let data = await dbquery(sql)
    res.json(data)
})

// 文章数据
router.get('/article',async (req,res)=>{
    let {page=1,pagesize=10} = req.query
    let offset = (page - 1) * pagesize
    let sql = `select t1.*,t2.cate_name from articlelist as t1 left join category as t2 on t1.sort = t2.cate_id
    where is_delete = 0 and t1.pub_status = 1 limit ${offset},${pagesize}
    `
    let data = await dbquery(sql)
    res.json(data)
})

// 查询指定分类的所有数据
router.get('/assign',async (req,res)=>{
    let {id,page,pagesize} = req.query
    let offset = (page - 1 ) * pagesize
    let sql = `select t1.cate_name,t2.* from category t1 left join articlelist t2 on t1.cate_id = t2.sort 
    where t1.cate_id = ${id} and is_delete = 0 limit ${offset},${pagesize}`
    let data = await dbquery(sql)
    res.json(data)
})

// 查询指定文章的数据详情
router.get('/detailData',async (req,res)=>{
    let {id} = req.query;
    let sql = `select t1.*,t2.cate_name from articlelist as t1 left join category as t2 on t1.sort = t2.cate_id where art_id = ${id}`
    let data = await dbquery(sql)
    res.json(data[0])
})

module.exports = router
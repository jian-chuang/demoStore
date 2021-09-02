const CryptoJS = require("crypto-js");
const path = require('path')
const fs = require('fs')
let serect = require('../moduleMysql/config.js')
let dbquery = require('../moduleMysql/mysql.js')
let userController = {}

// 登录页面
userController.loginPage = (req,res)=>{
    res.render('login.html')
}

userController.login = async (req,res)=>{
    let {username,password} = req.body
    password = CryptoJS.MD5(`${password}${serect}`).toString()
    let sql = `select * from user where user = '${username}' and password = '${password}'`
    let data = await dbquery(sql)
    if(data.length > 0){
       req.session.userInfo = JSON.stringify(data[0])
        res.json({code:10020,message:'登录成功',userInfo:data[0]})
    }else{
        res.json({code:10021,message:'用户或密码输入错误'})
    }
}
// 账号退出
userController.logout = (req,res)=>{
    req.session.destroy((err) => {
        if (err) { throw err }
    })
    res.redirect('/login')
}

// 头像上传
userController.uploadImg = (req,res)=>{
    let img = ''
    if(req.file){
        let {originalname,filename} = req.file
        let suffix = originalname.substring(originalname.indexOf('.'))
        let oldPath = path.join(__dirname, '../', 'uploads', filename);
        let newPath = path.join(__dirname, '../', 'uploads', filename) + suffix;
        img = `uploads/${filename}${suffix}`
        fs.renameSync(oldPath, newPath, err => {
            if (err) { throw err }
        })
        res.json({code:10022,img})
    }
}
// 数据库更新头像图片
userController.updateImg = async(req,res)=>{
    console.log(req.body);
    let {img} = req.body
    let {id} =JSON.parse(req.session.userInfo);
    let sql = `update user set img = '${img}' where id = ${id}`
    let result = await dbquery(sql)
    if(result.affectedRows){
        res.json({message:'上传成功',code:10024})
    }else{
        res.json({message:'上传失败',code:10025})
    }
}
module.exports = userController
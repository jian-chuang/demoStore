const mysql = require('mysql')
// 数据库导入
var connection = mysql.createConnection({
    host: "localhost", //主机
    port: '3306',	//端口
    user: "root",	//用户名
    password: "jkluio",	//密码
    database: "article"		//数据库
});

//连接mysql
connection.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log('connect mysql success');
});

// 封装调用sql语句函数
function callSql(sql){
    return new Promise((resolve,reject)=>{
        connection.query(sql,(err,rows)=>{
            if(err){
                reject(err) 
            }else{
                resolve(rows)
            }
        })
    })
}

module.exports = callSql


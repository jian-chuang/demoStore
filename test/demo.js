

const fs = require('fs')

function callback (content){
    return new Promise((reslove,reject)=>{
        fs.readFile(content,'utf-8',(err,data)=>{
            if(err){
                throw err
            }else{
                reslove(data)
            }
        })
    })
}
let content  = callback('./1.txt')
content.then((res)=>{
    console.log(res);
    return callback('./2.txt')
}).then(res=>{
    console.log(res);
})


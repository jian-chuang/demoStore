const express = require('express')
const path = require('path')
const moment = require('moment')
const router = require('./router/router.js')
const session = require('express-session')
const app = express()

// session配置（会自动给浏览器分配一个session）
app.use(session({
    name: 'SESSIONID',  // session会话名称在cookie中的值
    secret: '%#%￥#……%￥', // 必填项，用户session会话加密（防止用户篡改cookie）
    cookie: {  //设置session在cookie中的其他选项配置
        path: '/',
        secure: false,  //默认为false, true 只针对于域名https协议
        maxAge: 60000 * 24,  //设置有效期为24分钟，说明：24分钟内，不访问就会过期，如果24分钟内访问了。则有效期重新初始化为24分钟。
    }
}));
// 托管静态资源
app.use(express.static(path.join(__dirname, '/public')));
app.use("/uploads", express.static(path.join(__dirname, '/uploads')));

// 设置验证路由中间件统一管理路由验证
app.use((req, res, next) => {
    let routerPath = req.path.toLowerCase()
    console.log(routerPath);
    // 设置不需要验证的路由
    let noCheckSession = ['/login', '/submit', '/logout','/fetchdata'];
    if (noCheckSession.includes(routerPath)) {
        next()
    } else {
        if (req.session.userInfo) {
            console.log('验证通过');
            // 权限通过
            next()
        } else {
            // 验证失败
            console.log('验证失败');
            res.redirect('/login')
            return;
        }
    }
})
// 模板引擎
const artTemplate = require('art-template');
const express_template = require('express-art-template');

app.set('views', __dirname + '/views/');

app.engine('html', express_template);

app.set('view engine', 'html');



// post请求中间件
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


// 时间过滤器
artTemplate.defaults.imports.dateFormat = function (time, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment.unix(time).format(format);
}

// 时间过滤器
artTemplate.defaults.imports.timeFormat = function (date, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(date).format(format);
}





// 路由挂载
app.use(router)


app.listen(3000, () => {
    console.log('sucsess running at port');
})
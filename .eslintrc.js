module.exports = {
    // 只会在当前目录获取eslint配置文件，不会跑到父级目录中
    "root": true,
    // 指定代码运行的环境，指定后方可使用一些全局变量如：window，console，global等等
    "env": {
        "browser": true,
        "es2021":true,
        "node": true
    },
    //继承recommended的所有语法规则,recommended查看官网rules
    "extends": `eslint:recommended`,
    // 指定解析js的ecma版本 
    "parserOptions": {
        "ecmaVersion": 12
    },
    "ignorePatterns":[`**/node_modules/*`],
    // 具体规则的配置
    //（关闭规则：'off' 或 0   ） （警告规则：'warn' 或 1   ） （错误退出：'error' 或 2   ）
    "rules": {
        "no-unused-vars": 1,
        "no-constant-condition": `error`,
        "no-empty": 2,
        "quotes": [`error`, `backtick`,{"avoidEscape": true,"allowTemplateLiterals": true}],
        "no-multi-spaces": [`warn`,{ ignoreEOLComments: false} ]
    }
};

const chokidar = require(`chokidar`);
const execSh = require(`exec-sh`);

// eslint 监听当前目录
chokidar.watch('./',{
    persistent:true,
    ignored:['node_modules','bulid/eslint.js']
}).on('all', (event, path) => {
    console.log(event, path);
    // 文件修改了，自动执行eslint检测语法
    if (event === `change`) {
        execSh(`npx eslint ${path} --fix`, function (err) {
            if (err) {
                console.log(`Exit code: `, err.code);
            }
        });
    }
});
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// 读取SQL文件
const sqlFile = path.join(__dirname, 'database.sql');
const sqlContent = fs.readFileSync(sqlFile, 'utf8');

// 连接到SQLite数据库
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
    if (err) {
        console.error('数据库连接失败:', err.message);
        process.exit(1);
    }
    console.log('已连接到SQLite数据库');
});

// 执行SQL语句
db.serialize(() => {
    // 将SQL文件内容按分号分割成单独的语句
    const statements = sqlContent
        .split(';')
        .map(statement => statement.trim())
        .filter(statement => statement.length > 0);

    // 逐个执行SQL语句
    statements.forEach((statement) => {
        db.run(statement, (err) => {
            if (err) {
                console.error('执行SQL语句时出错:', err.message);
                console.error('问题语句:', statement);
            }
        });
    });

    console.log('数据库初始化完成');
});

// 关闭数据库连接
db.close((err) => {
    if (err) {
        console.error('关闭数据库连接时出错:', err.message);
        process.exit(1);
    }
    console.log('数据库连接已关闭');
});
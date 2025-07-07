module.exports = {
    env: {
        node: true,
        commonjs: true,
        es2021: true
    },
    parserOptions: {
        ecmaVersion: "latest"
    },
    rules: {
        "no-undef": "error",           // 禁止使用未定义的变量
        "no-unused-vars": "warn",      // 未使用的变量给出警告
        "no-const-assign": "error",    // 禁止修改const声明的变量
        "no-dupe-args": "error",       // 禁止function参数重名
        "no-dupe-keys": "error",       // 禁止对象字面量中出现重复的key
        "no-unreachable": "error",     // 禁止出现无法达到的代码
        "no-case-declarations": "off"   // 允许在case中使用声明
    }
} 
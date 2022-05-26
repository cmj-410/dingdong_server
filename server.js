const http = require('http')
const fs = require("fs")
const config = require('./config')

const server = http.createServer((req, res) => {
    const url = req.url
    const method = req.method
    const [path, queryStr] = url.split('?')
    const params = new URLSearchParams(queryStr)

    // 已经配置的路由
    const routeList = config.routes
    const basePath = config.basePath
    const havePath = {
        has: false,
        path: ''
    }
    // 查找是否配置该路由
    routeList.every(route => {
        if (basePath + route.path === path && route.method === method){
            havePath.has = true
            havePath.path = route.path
            return false
        }
        return true
    })
    if (!havePath.has){
        res.end('404 not found')
    } 
    // 根据方法划分
    if (method === 'GET'){
        // 根据请求地址到data中去找
        const rawdata = fs.readFileSync('data' + havePath.path + '.json')
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
        res.write(rawdata)
        res.end()
    }
    if (method === 'POST'){
        let bodyStr = ''
        req.on('data', chunk => {
            bodyStr += chunk.toString()
        })
        req.on('end', () => {
            const body = JSON.parse(bodyStr)
            const name = body.account
            const password = body.password
            let dataurl
            if (name === config.account.name && password === config.account.password){
                // 根据请求地址到data中去找
                dataurl = 'data' + havePath.path + '_success' + '.json'
            } else {
                dataurl = 'data' + havePath.path + '_fail' + '.json'
            }
            const rawdata = fs.readFileSync(dataurl)
            res.writeHead(200, {
                'Content-Type': 'application/json',
                // 允许跨域
                'Access-Control-Allow-Origin': '*'
            })
            res.write(rawdata)
            res.end()
        })
    }
    // 为了post跨域，需要配置options
    if (method === 'OPTIONS'){
        res.writeHead(200, {
            'Access-Control-Allow-Headers': 'Content-Type',
            // 'Access-Control-Allow-Methods': 'POST', 
            'Access-Control-Allow-Methods': 'GET,POST,PATCH',
            'Access-Control-Allow-Origin': '*'
            // 'Access-Control-Allow-Origin': 'http://192.168.0.101'
        })
        res.end()
    }
    if (method === 'PATCH'){
        let bodyStr = ''
        req.on('data', chunk => {
            bodyStr += chunk.toString()
        })
        req.on('end', () => {
            const body = JSON.parse(bodyStr)
            const fileUrl = 'data' + havePath.path + '.json'
            const rawdata = fs.readFileSync(fileUrl)
            const jsonData = JSON.parse(rawdata)
            jsonData.data.push(body)
            fs.writeFile(fileUrl, JSON.stringify(jsonData, null, 2), e => {
                if(e){
                    console.log(e.message)
                }
            })
            res.writeHead(200, {
                'Content-Type': 'application/json',
                // 允许跨域
                'Access-Control-Allow-Origin': '*',
                // 'Access-Control-Allow-Methods': 'PATCH',
            })
            res.end()
        })
    }
})

const port = 3000
const hostname = '127.0.0.1'
server.listen(port, hostname, () => {
    console.log(port, ' ... listening')
})
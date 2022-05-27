const http = require('http')
const fs = require("fs")
const config = require('./config')

const server = http.createServer((req, res) => {
    const url = req.url
    const method = req.method
    const path = url.split('?')[0]
    // const [path, queryStr] = url.split('?')
    // const params = new URLSearchParams(queryStr)
    // console.log(path, Object.keys(params))

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
        // post登录
        if (havePath.path === '/user/login'){
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
        } else {
            // 写入新地址
            if (havePath.path === '/address/info'){
                let bodyStr = ''
                req.on('data', chunk => {
                    bodyStr += chunk.toString()
                })
                req.on('end', () => {
                    const body = JSON.parse(bodyStr)
                    const fileUrl = 'data/address/info.json'
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
                        'Access-Control-Allow-Origin': '*'
                    })
                    res.end()
                })
            }
        }
    }
    // 为了post跨域，需要配置options
    if (method === 'OPTIONS'){
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
        })
        res.end()
    }
})

const port = 3000
const hostname = '127.0.0.1'
server.listen(port, hostname, () => {
    console.log(port, ' ... listening')
})
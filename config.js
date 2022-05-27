module.exports = {
    account:{
        name: 'cmj',
        password: '098765'
    },
    basePath: '/api',
    routes: [
        {
            path: '/user/login',
            method: 'POST'
        }, {
            path: '/user/login',
            method: 'OPTIONS'
        }, {
            path: '/address/info',
            method: 'GET'
        }, {
            path: '/address/info',
            method: 'POST'
        }, {
            path: '/address/info',
            method: 'OPTIONS'
        },{
            path: '/shop/hot-list',
            method: 'GET'
        }, {
            path: '/shop/1',
            method: 'GET'
        }, {
            path: '/shop/2',
            method: 'GET'
        }, {
            path: '/shop/3',
            method: 'GET'
        }, {
            path: '/shop/4',
            method: 'GET'
        }, {
            path: '/shop/5',
            method: 'GET'
        }
    ]
}

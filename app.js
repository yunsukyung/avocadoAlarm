const express = require('express')

const socket = require('socket.io')

const http = require('http')

const fs = require('fs')

const app = express()

const server = http.createServer(app)

const io = socket(server)

const oracledb = require('oracledb')

oracledb.getConnection({
    user: 'admin',
    password: '1q2w3e4r',
    connectString: 'avocado.cbc0ccwbzvie.ap-northeast-2.rds.amazonaws.com/ORCL'
}, function(err, connection) {
    if(err){
        console.log('접속 실패', err);
        return;
    }
    console.log('접속 성공');

    connection.execute("select * from USER_LIST", {}, {outFormat:oracledb.OBJECT}, function (err, result) {
        if(err) throw err;
    
        console.log('query read success');
    
        dataStr = JSON.stringify(result.rows);
        console.log(dataStr);

        arrStr = JSON.stringify(result.rows);
        var arr = JSON.parse(arrStr);
        console.log(arr);
    
        console.log(arr[0].USER_ID);
    });



});



app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

app.get('/', function(request, response) {
    fs.readFile('./static/js/index.html', function(err, data) {
        if(err) {
            response.send('에러')
        } else {
            response.writeHead(200, {'Content-Type':'text/html'})
            response.write(data)
            response.end()
        }
    })
})

io.sockets.on('connection', function(socket) {
    console.log('유저 접속 됨')

    socket.on('newMsg', function(data) {
        console.log('값이들어온다')
    })

    socket.on('send', function(data) {
        console.log('전달된 메시지: ', data.msg)
    })

    socket.on('disconnect', function() {
        console.log('접속 종료')
    })
})

server.listen(8002, function() {
    console.log('서버실행중...')
})
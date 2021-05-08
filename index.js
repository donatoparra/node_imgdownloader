var http = require('http');
var fs = require('fs');
var request = require('request');

var server = http.createServer(function(req, res) {
    
    if (req.method == 'POST') {
        
        var body;
        req.on('data', function(data) {
            if (body) {
                body += data
            } else {
                body = data;
            }
            
        });
        
        req.on('end', function() {        
            
            var str = body.toString('utf8');
            var payload = JSON.parse(JSON.parse(str));

            const download = (res, url, path, callback) => {
                
                request.head(url, (err, response, body) => {
                  request(url)
                    .pipe(fs.createWriteStream(path))
                    .on('close', function () {
                        res.end('done');
                    })
                })
            }

            const dir = './' + payload.usuario;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, {
                    recursive: true
                });
            }

            const path = dir + '/' + payload.nombreImagen + '.jpeg';

            download(res, payload.url, path, () => {
                console.log('Done!')
            });
        
        });

    } else {
        res.end('metodo no habilitado')
    }
    
});

server.listen(3000);
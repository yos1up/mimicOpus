var express = require('express');

var app = express();

var server_cmn = require('./server_cmn');

app.set('port', process.env.PORT || 5000);

var clientPath = __dirname.replace("/server", "/build");
app.use('/', express.static(clientPath));

server_cmn.server_cmn(app);

app.listen(app.get('port'), () => {
    console.log('server listening on port :' + app.get('port'));
});

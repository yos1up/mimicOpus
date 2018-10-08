var express = require('express');

var app = express();

app.set('port', process.env.PORT || 5000);

var clientPath = __dirname.replace("/server", "/build");
app.use('/', express.static(clientPath));

app.listen(app.get('port'), () => {
    console.log('server listening on port :' + app.get('port'));
});

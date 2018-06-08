//routing for index.html
module.exports = function(app)
{
    app.get('/', function(req, res)
    {
        res.sendFile('./index.html');
    });

    app.get('/test', function(req, res) {
       res.sendFile('./test.html');
    });
};

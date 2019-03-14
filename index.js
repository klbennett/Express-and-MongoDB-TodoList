const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const monk = require('monk');

const app = express();

// Set up view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static(__dirname + '/public'))

const urlencodedParser = bodyParser.urlencoded({ extended: false })
const db = monk('localhost:27017/mongotodo');

app.use(function(req,res,next) {
    req.db = db;
    next();
});

app.get('/todo', function(req, res) {
    const db = req.db;
    const collection = db.get('todocollection');
    collection.find({},{},function(err,docs){
        res.render('index', {
            "todos" : docs
        });
    });
})

app.get('/todo/:id', function(req, res) {
    const db = req.db;
    const id = req.params.id;
    const collection = db.get('todocollection');
    collection.find({ '_id' : id }, function (err, doc){
        if(err) {
            res.send('Todo not found').status(404)
        }else{
            res.render('detail', {
                "todo" : doc[0]
            });
        }
    });
})

app.post('/todo', urlencodedParser, function(req, res) {
    console.log('hi from addtodo')
    const db = req.db;
    const todo = req.body.todo;
    const collection = db.get('todocollection');
    console.log(todo)
    collection.insert({
        todo: todo,
        done: false,
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("todo");
        }}
    )
})

app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000!')

module.exports = app
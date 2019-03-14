const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');

const app = express();
const monk = require('monk');

// Set up view engine
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'))

const db = monk('localhost:27017/mongotodo');

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.get('/todo', function(req, res) {
    const db = req.db;
    const collection = db.get('todocollection');
    collection.find({},{},function(e,docs){
        res.render('index', {
            "todos" : docs
        });
    });
})

app.post('/todo/add/', function(req, res) {
    const db = req.db;
    const todo = req.body.todo;
    const done = req.body.todo;
    collection.insert({
        todo: todo,
        done: done,
    }, (err, doc) => {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("todos");
        }
    })
})

app.get('/todo/delete/:id', function(req, res) {
    if (req.params.id != '') {
        todos.splice(req.params.id, 1);
    }
    res.redirect('/todo');
})

app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000!')

module.exports = app
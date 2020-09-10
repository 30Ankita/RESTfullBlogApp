if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}


var bodyParser = require('body-parser'),
    express = require('express'),
    methodOverride = require('method-override'),
    app = express();
    mongoose = require('mongoose'),

//mongoose.connect("mongodb://localhost/blogapp");
mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser : true})
const db = mongoose.connection
db.on('error',error => console.error(error))
db.once('open',() => console.log('Connected to Mongoose'))

//APP CONFIG
app.set("view engine","ejs");
app.set('views',__dirname + '/views')
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image : String,
    body : String,
    created : {type : Date, default : Date.now}
});

var Blog = mongoose.model("Blog" , blogSchema) ;

//ROUTES
app.get("/",function(req,res){
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        res.render("index.ejs",{blogs:blogs});
    });
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs",function(req,res){
    Blog.create(req.body.blog , function(err,newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog : foundBlog});
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog : foundBlog});
        }
    });
  
});

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id , req.body.blog , function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id , function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});


app.listen(process.env.PORT || 3000,function(){
    "SERVER IS RUNNING !!";
});

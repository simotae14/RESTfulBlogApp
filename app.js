var bodyParser   = require("body-parser"),
methodOverride   = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose         = require("mongoose"),
express          = require("express"),
app              = express();

// APP CONFIG
// creo il db
mongoose.connect("mongodb://localhost/restful_blog_app");

// METODI SPESSO PRESENTI DENTRO OGNI PROGETTO
// setto le view come ejs
app.set("view engine", "ejs");
// setto come cartella per le parti statiche, css, js
// la cartella public
app.use(express.static("public"));
// uso bodyParser
app.use(bodyParser.urlencoded({extended: true}));
// uso expressSanitizer
app.use(expressSanitizer());

// uso methodOverride
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
// CREO SCHEMA E MODEL DEL BLOG
var blogSchema = new mongoose.Schema({
  titolo: String,
  immagine: String,
  corpo: String,
  // creo data
  creato: { 
    type: Date, 
    default: Date.now 
  }
});
// creo model
var Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES
// ROOT
app.get("/", function(req, res) {
   res.redirect("/blogs"); 
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
  // recupero tutti i blog
  Blog.find({}, function(err, blogs){
    if(err) {
      console.log("ERRORE!");
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res) {
   res.render("new"); 
});

// CREATE ROUTE
app.post("/blogs", function(req,res){
  // CREO IL BLOG
  // sanitizzo il corpo del post da eventuali script
  req.body.blog.corpo = req.sanitize(req.body.blog.corpo);

  Blog.create(req.body.blog, function(err, newBlog){
    if(err) {
      // reindirizzo ancora alla view new
      res.render("new");
    } else {
      // REDIRECT ALL'INDEX
      res.redirect('/blogs');
    }
  });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
  // RECUPERO IL BLOG
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err) {
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
  // RECUPERO IL BLOG
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
  // sanitizzo il corpo del post da eventuali script
  req.body.blog.corpo = req.sanitize(req.body.blog.corpo);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id); 
    }
  });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  })
});

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("SERVER IN ESECUZIONE!");
});
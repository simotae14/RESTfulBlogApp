var bodyParser = require("body-parser"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();

// APP CONFIG
// creo il db
mongoose.connect("mongodb://localhost/restful_blog_app");
// setto le view come ejs
app.set("view engine", "ejs");
// setto come cartella per le parti statiche, css, js
// la cartella public
app.use(express.static("public"));
// uso bodyParser
app.use(bodyParser.urlencoded({extended: true}));

// MONGOOSE/MODEL CONFIG
// CREO SCHEMA E MODEL DEL BLOG
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  // creo data
  created: { type: Date, default: Date.now }
});
// creo model
var Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES
// ROOT
app.get("/", function(req, res) {
   res.redirect("/blogs"); 
});

// INDEX
app.get("/blogs", function(req, res){
  // recupero tutti i blog
  Blog.find({}, function(err, blogs){
    if(err) {
      console.log("ERROR!");
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("SERVER IS RUNNING!");
});
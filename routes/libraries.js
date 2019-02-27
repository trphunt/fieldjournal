var express = require("express");
var router = express.Router();
var Library = require("../models/library");
var middleware = require("../middleware");

//INDEX - show all libraries
router.get("/", function(req, res){
    // Get all libraries from DB
    Library.find({}, function(err, alllibraries){
        if(err){
            console.log(err);
        } else {
            res.render("libraries/index", {libraries: alllibraries});
        }
    });
});

// CREATE - add new library to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to libraries array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newLibrary = {name: name, image: image, description: desc, author: author};
    // Create a new library and save to DB
    Library.create(newLibrary, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           //redirect back to libraries page
           res.redirect("/libraries");
       }
    });
});

// NEW - show form to create new library
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("libraries/new");
});


// SHOW - shows more info about one library
router.get("/:id", function(req, res){
    //find the library with provided ID
    Library.findById(req.params.id).populate("entries").exec(function(err, foundLibrary){
        if(err){
            console.log(err);
        } else {
            //render show template with that Library
            res.render("libraries/show", {library: foundLibrary});
        }
    });
});

// EDIT LIBRARY ROUTE
router.get("/:id/edit", middleware.checkLibraryOwnership, function(req, res){
    Library.findById(req.params.id, function(err, foundLibrary){
        if(err){
            req.flash("error", "Library doesn't exist");
        } else {
            res.render("libraries/edit", {library: foundLibrary});
        }
    });
});

// UPDATE LIBRARY ROUTE
router.put("/:id", middleware.checkLibraryOwnership, function(req, res){
    Library.findByIdAndUpdate(req.params.id, req.body.library, function(err, updatedLibrary){
        if(err){
            res.redirect("/libraries");
        } else {
            //redirect somewhere(show page)
            res.redirect("/libraries/" + req.params.id);
        }
    });
});

// DESTROY LIBRARY ROUTE
router.delete("/:id", middleware.checkLibraryOwnership, function(req, res){
    Library.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/libraries");
        } else {
            req.flash("success", "Library deleted");
            res.redirect("/libraries");
        }
    });
});

module.exports = router;
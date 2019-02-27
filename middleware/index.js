var Library = require("../models/library");
var Entry = require("../models/entry");

var middlewareObj = {};

middlewareObj.checkLibraryOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Library.findById(req.params.id, function(err, foundLibrary){
            if(err){
                req.flash("error", "Library not found");
                res.redirect("back");
            } else {
                // does user own the library?
                if(foundLibrary.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkEntryOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Entry.findById(req.params.entry_id, function(err, foundEntry){
            if(err){
                res.redirect("back");
            } else {
                // does user own the entry?
                if(foundEntry.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/login");
};

module.exports = middlewareObj;
var express = require("express");
var router = express.Router({mergeParams: true});
var Library = require("../models/library");
var Entry = require("../models/entry");
var middleware = require("../middleware");

//ENTRIES NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find library by id
    console.log(req.params.id);
    Library.findById(req.params.id, function(err, library){
        if(err){
            console.log(err);
        } else {
            res.render("entries/new",{library: library});
        }
    });
});

//ENTRIES CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup library using ID
   Library.findById(req.params.id, function(err, library){
       if(err){
           console.log(err);
           res.redirect("/libraries");
       } else {
           Entry.create(req.body.entry, function(err, entry){
               if(err){
                   req.flash("error", "Something went wrong");
                   console.log(err);
               } else {
                   //add username and id to entry
                   entry.author.id = req.user._id;
                   entry.author.username = req.user.username;
                   //save entry
                   entry.save();
                   library.entries.push(entry);
                   library.save();
                   console.log(entry);
                   req.flash("success", "Successfully added entry");
                   res.redirect("/libraries/" + library._id);
               }
           });
       }
   });
});

// ENTRY EDIT ROUTE
router.get("/:entry_id/edit", middleware.checkEntryOwnership, function(req, res){
   Entry.findById(req.params.entry_id, function(err, foundEntry){
       if(err){
           res.redirect("back");
       } else {
           res.render("entries/edit", {library_id: req.params.id, entry:foundEntry});
       }
   });
});

// ENTRY UPDATE ROUTE
router.put("/:entry_id", middleware.checkEntryOwnership, function(req, res){
    Entry.findByIdAndUpdate(req.params.entry_id, req.body.entry, function(err, updatedEntry){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/libraries/" + req.params.id);
        }
    });
});

// ENTRY DESTROY ROUTE
router.delete("/:entry_id", middleware.checkEntryOwnership, function(req, res){
    //findByIdAndRemove
    Entry.findByIdAndRemove(req.params.entry_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Entry deleted");
            res.redirect("/libraries/" + req.params.id);
        }
    });
});

module.exports = router;
var express=require("express");
var router=express.Router({mergeParams: true});
var campground=require("../models/campground");
var middleware = require("../middleware/index");


router.get("/campgrounds",function(req,res){
    campground.find({},function(err,allcampgrounds){
        if(err){
            req.flash("error", err);
        } else{
            res.render("campgrounds/index",{campgrounds:allcampgrounds, currentuser: req.user});
        }
    })
})

router.get("/campgrounds/new", middleware.isloggedin ,function(req,res){
    res.render("campgrounds/new");
})

router.post("/campgrounds", middleware.isloggedin ,function(req,res){
    
    var author={
        id: req.user.id,
        username: req.user.username
    };

    campground.create({name: req.body.name, image: req.body.image,price: req.body.price ,description: req.body.description, author: author } , function(err,campground){
        if(err){
            req.flash("error", err);
        } else{
            console.log(campground);
        }
    })
    req.flash("success", "Successfully campground is created");
    res.redirect("/campgrounds");
})

router.get("/campgrounds/:id",function(req,res){
    campground.findById(req.params.id).populate("comments").exec(function(err, foundcampground){
        if(err){
            req.flash("error", err);
        }
        else{
            res.render("campgrounds/show",{campground: foundcampground} );
        }
    })
})

router.get("/campgrounds/:id/edit", middleware.checkcampownership ,function(req,res){
    campground.findById(req.params.id, function(err, foundcampground){
        if(err){
            req.flash("error", err);
            res.redirect("/campgrounds");
        }
        else{
            res.render("campgrounds/edit",{campground: foundcampground} );
        }
    })
})

router.put("/campgrounds/:id", middleware.checkcampownership ,function(req,res){
    campground.findByIdAndUpdate(req.params.id,req.body.camp ,function(err, updatedcampground){
        if(err){
            req.flash("error", err);
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success", "Successfully campground is updated");
            res.redirect("/campgrounds");
        }
    })
})

router.delete("/campgrounds/:id", middleware.checkcampownership ,function(req,res){
    campground.findByIdAndRemove(req.params.id ,function(err){
        if(err){
            req.flash("error", err);
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success", "Successfully campground is deleted");
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;
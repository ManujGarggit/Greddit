require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.set('strictQuery', true);

const dbURI = "mongodb+srv://admin:admin@manuj.mbe4vkf.mongodb.net/Dass?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(5000))
    .catch((err) => console.log(err));

const CredSchema = new mongoose.Schema({
    Firstname: String,
    LastName: String,
    UserName: String,
    Age: Number,
    Password: String,
    EmailId: String,
    Contact: Number,
    Followers: Array,
    Following: Array,
    About: String,
    Saved:{
        type:[Object] // will have the name of the subgreddit and the id of the post
    }
})

const ReportSchema = new mongoose.Schema({
    ReportedBy:String,
    ReportedUser:String,
    Concern:String,
    Text:String,
    State:Number, // 1 for ignore , 2 for blocked , 3 for deleted
    Greddit:String,
    id:Number,
    Touched:Number
},{timestamps:true})

const RejectedSchema = new mongoose.Schema({
    Name:String,
    EmailId:String
})

const GredSchema = new mongoose.Schema({
    Name:{
        required:true,
        type:String,
    },
    Description:{
        required:true,
        type:String,
    },
    Key:{
        type:[String]
    },
    Follower:{
        type:[String]
    },
    Moderator:{
        type:[String]
    },
    Tag:{
        type:[String]
    },
    Joined:{
        type:[String]
    },
    Blocked:{
        type:[String]
    },
    Requested:{
        type:[Object]
    },
    Left:{
        type:[String]
    },
    Post:{
        type:[Object]
    },
    Report:{
        type:[ReportSchema]
    },
    Rejected:{
        type:[RejectedSchema]
    }
},{timestamps:true})

const Gred = mongoose.model("Gred",GredSchema);

const Cred = mongoose.model("Cred", CredSchema);

// to register the user
app.post("/api/register", function (req, res) {
    const toFind = req.body.UserName;
    console.log(req.body);
    let temp1;
    let temp2;
    let temp3;
    let emailver = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(emailver.test(req.body.EmailId)===true) temp1=1;
    else temp1=0;
    const tempvalue = isNaN(req.body.Age);
    if(tempvalue===false){
      if(req.body.Age>=8 && req.body.Age<=100) temp2=1;
      else temp2=0;
    }
    const tempval = isNaN(req.body.Contact);
    if(tempval===false){
      if(req.body.Contact.length===10) temp3=1;
      else temp3=0;
    }
    if(temp1 && temp2 && temp3){
        Cred.findOne({ UserName: toFind }, function (err, foundCred) {
            if (err) console.log(err)
            else {
                if (!foundCred) {
                    const toPost = new Cred({
                        Firstname: req.body.FirstName,
                        LastName: req.body.LastName,
                        UserName: req.body.UserName,
                        Age: req.body.Age,
                        Password: md5(req.body.Password),
                        EmailId: req.body.EmailId,
                        Contact: req.body.Contact,
                        Followers: [],
                        Following: [],
                        About: "write about you in here"
                    })
                    toPost.save();
                    res.send("1");
                }
                else res.send("0");
            }
        })
    }
    else{
        res.send("2");
    }
});

// to validate the user 
app.post("/api/login", function (req, res) {
    const toFind = md5(req.body.Password);
    console.log(req.body);
    Cred.findOne({ UserName: req.body.UserName, Password: toFind }, function (err, foundCred) {
        if (err) {
            console.log(err);
            res.send("error");
        }
        else {
            if (!foundCred) res.send("0");
            else {
                const username = req.body.UserName;
                const user = { name: username };
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                res.json({accessToken:accessToken});
            }
        }
    })

})

// to check if a user is logged in or not and give back the details to it (have to build a middleware)
app.post("/api/profile", authenticate,function (req, res) {
    const ToFind = req.user.name;
    Cred.findOne({UserName:ToFind},function(err,foundCred){
        if(err){
            console.log(err);
            res.send("TokenButError"); 
        }
        else{
            if(!foundCred) res.send("TokenNoUser"); // here no user is found based on off the token (can't happen)
            else res.send(foundCred);
        }
    })
})

// here is to change the profile info
app.post("/api/profile/change",authenticate,function (req,res){
    const ToFind = req.body.UserName;
    Cred.findOneAndUpdate({UserName:ToFind},{Firstname:req.body.FirstName,LastName:req.body.LastName,UserName:req.body.UserName,Age:req.body.Age,EmailId:req.body.EmailId,Contact:req.body.Contact,About:req.body.About},function(err,foundCred){
        if(err) console.log(err)
        else res.send("1");
    })
})

// this is to remove the follower
app.post("/api/profile/RemFollower",authenticate,function (req,res){
    const ToRemove = req.body.ToRemove;
    const ToFind = req.body.UserName;
    Cred.findOneAndUpdate({UserName:ToFind},{$pull:{Followers:ToRemove}},function(err,foundCred){
        if(err) console.log(error);
        else res.send("1");
    })
})

// this is remove the following
app.post("/api/profile/RemFollowing",authenticate,function (req,res){
    const ToRemove = req.body.ToRemove;
    const ToFind = req.body.UserName;
    Cred.findOneAndUpdate({UserName:ToFind},{$pull:{Following:ToRemove}},function(err,foundCred){
        if(err) console.log(error);
        
    })
    Cred.findOneAndUpdate({UserName:ToRemove},{$pull:{Followers:ToFind}},function(err,foundCred){
        if(err) console.log(error);
        else res.send("1");
    })
})


// to add a new subGreddit (the greddits is unique )
app.post("/api/profile/AddMySubGred",authenticate,function (req,res){
    const ToFind = req.body.Name;
    console.log(ToFind);
    Gred.findOne({Name:ToFind},function(err,foundGred){
        if(err) console.log(err)
        else{
            if(!foundGred){
                const toPost = new Gred({
                    Name:req.body.Name,
                    Description:req.body.Des,
                    Key:req.body.Key,
                    Tag:req.body.Tag,
                    Follower:[req.user.name],
                    Moderator:[req.user.name],
                    Joined:[req.user.name],
                    Blocked:[],
                    Requested:[],
                    Left:[]
                })
                toPost.save();
                res.send("1");
            }
            else res.send("0");
        }
    })
});

app.post("/api/profile/GetMySubGred",authenticate,function (req,res){
    const ToFind = req.user.name;
    // i have to find all the posts where the moderator is myself and return them 
    Gred.find({Moderator:ToFind},function(err,foundGreds){
        if(err) console.log(err)
        else {
            if(foundGreds){
                console.log(foundGreds);
                res.send(foundGreds);
            }
            else res.send("Not A Mod");
        }
    })
})

// to delete a SubGred (can be done only by the name as it is unique)
app.post("/api/profile/DelMySubGred",authenticate,function (req,res){
    const ToFindName = req.body.Name;
    const ToFindUser = req.user.name;
    console.log(req.body.Name);
    Gred.findOneAndDelete({Name:ToFindName},function(err,foundGred){
        if(err) console.log(err)
        else{
            if(foundGred){
                const Mod = foundGred.Moderator;
                const temp1 = Mod.indexOf(ToFindUser);
                if(temp1>=0){
                    Gred.findOneAndDelete({Name:ToFindName},function(err,foundGred){
                        if(err) console.log(err)
                        else{
                            if(foundGred){
                                Cred.find({},function (err,foundCreds){
                                    if(err) console.log(err);
                                    else{
                                        if(foundCreds){
                                            const NewArr = foundCreds;
                                            const len = NewArr.length;
                                            for(var i=0;i<len;i++){
                                                const NewThing = NewArr[i].Saved;
                                                const SavedN = NewThing.filter((value)=>{return value.GredName!==ToFindName});
                                                Cred.findOneAndUpdate({UserName:NewArr[i].UserName},{$set:{Saved:SavedN}},function (err,foundCred){
                                                    if(err) console.log(err);
                                                    else{
                                                        if(!foundCred) res.send("3");
                                                    }
                                                })
                                            }
                                            res.send("1");
                                        }
                                        else res.send("2");
                                    }
                                })
                            }
                            else res.send("0");
                        }
                    })
                }
                else res.send("Not A Mod")
            }
            else res.send("0");
        }
    })
})

app.post("/api/profile/GetAGreddit",authenticate, function (req,res){
    const ToFindName = req.body.Name;
    const ToFindUser = req.user.name;
    Gred.findOne({Name:ToFindName},function (err,foundGred){
        if(err) console.log(err)
        else{
            if(foundGred) {
                const Mod = foundGred.Moderator;
                const temp1 = Mod.indexOf(ToFindUser);
                if(temp1>=0) res.send(foundGred);
                else res.send("Not A Mod");
            }
            else res.send("0");
        }
    })
})

app.post("/api/profile/GetAGredditWithName", authenticate,function (req,res){
    const ToFind = req.user.name;
    const ToFindName = req.body.Name;
    Gred.findOne({Name:ToFindName},function (err,foundGred){
        if(err) console.log(err)
        else{
            if(foundGred) res.send({Mod:foundGred.Moderator,UserName:ToFind});
            else res.send("0");
        }
    })
})

app.post("/api/profile/GetAGredditWithNameJoin",authenticate,function (req,res){
    const ToFind = req.user.name;
    const ToFindName = req.body.Name;
    Gred.findOne({Name:ToFindName},function (err,foundGred){
        if(err) console.log(err)
        else{
            if(foundGred) res.send({Joined:foundGred.Joined,UserName:ToFind});
            else res.send("0");
        }
    })
})

// to accept the requested user
app.post("/api/profile/Requests/Accept",authenticate,function (req,res){
    const ToFindG = req.body.NameG;
    const ToFind = req.body.Name;
    Gred.findOneAndUpdate({Name:ToFindG},{
        $pull:{Requested:{Name:ToFind}},
        $push:{
            Follower:ToFind,
            Joined:ToFind
        }
    },function (err,foundGred){
        if(err) console.log(err);
        else{
            if(foundGred) res.send("1");
            else res.send("0");
        }
    })
})

// to reject the requested user
app.post("/api/profile/Requests/Reject",authenticate,function (req,res){
    const ToFindG = req.body.NameG;
    const ToFind = req.body.Name;
    const ToFindEmail = req.body.Email;
    Gred.findOneAndUpdate({Name:ToFindG},{
        $pull:{
            Requested:{
                Name:ToFind
            }
        },
        $push:{
            Rejected:{
                Name:ToFind,
                EmailId:ToFindEmail
            }
        }
    },function (err,foundGred){
        if(err) console.log(err);
        else{
            if(foundGred) res.send("1");
            else res.send("0");
        }
    })
})

// to get all the subgreddits
app.post("/api/profile/GetSubGred",authenticate,function(req,res){
    console.log(req.body.accessToken);
    Gred.find({},function(err,foundGreds){
        if(err) console.log(err);
        else{
            if(foundGreds) res.send(foundGreds);
            else res.send("0");
        }
    })
})

// to get the join array
app.post("/api/GetJoin",authenticate,function(req,res){
    const ToFind = req.user.name;
    Gred.find({Joined:ToFind},function (err,foundGreds){
        if(err) console.log(err);
        else{
            if(foundGreds) res.send(foundGreds);
            else res.send("0");
        }
    })
})

// to get the moderators array
app.post("/api/GetMod",authenticate,function(req,res){
    const ToFind = req.user.name;
    Gred.find({Moderator:ToFind},function (err,foundGreds){
        if(err) console.log(err);
        else{
            if(foundGreds) res.send(foundGreds);
            else res.send("0");
        }
    })
})

// to get details of user
app.post("/api/GetUser",authenticate,function (req,res){
    const ToFind = req.user.name;
    Cred.findOne({UserName:ToFind},function (err,foundCred){
        if(err) console.log(err);
        else{
            if(foundCred) res.send({
                Email:foundCred.EmailId,
                User:ToFind
            });
            else res.send("0");
        }
    })
})

// to handle the leave request of a subgreddit
app.post("/api/profile/Leave",authenticate, function (req,res){
    const ToFindNameG = req.body.NameG;
    const ToFindNameU = req.body.NameU;
    console.log(ToFindNameG);
    console.log(ToFindNameU);
    Gred.findOne({Name:ToFindNameG},function (err,foundGred){
        if(err) console.log(err);
        else{
            if(foundGred){
                const Mod = foundGred.Moderator;
                const temp2 = Mod.indexOf(ToFindNameU);
                if(temp2>=0) res.send("1");
                else{
                    Gred.findOneAndUpdate({Name:ToFindNameG},{
                        $pull:{
                            Joined:ToFindNameU,
                            Follower:ToFindNameU
                        },
                        $push:{Left:ToFindNameU}
                    },function (err,foundGred){
                        if(err) console.log(err);
                        else{
                            if(foundGred) res.send("2");
                            else res.send("3");
                        }
                    })
                }
            }
        }
    })
})

// to join the subgreddit
app.post("/api/profile/Join",authenticate,function(req,res){
    const D = new Date();
    const User = req.body.NameU;
    const Greddit = req.body.NameG;
    const EmailId = req.body.EmailU;
    Gred.findOne({Name:Greddit},function(err,foundGred){
        if(err) console.log(err);
        else{
            const LeftG = foundGred.Left;
            const RequestedG = foundGred.Requested;
            const Rejected = foundGred.Rejected;
            const Block = foundGred.Blocked;
            const temp2 = LeftG.indexOf(User);
            const temp1 = RequestedG.find(value=>value.Name===User);
            const temp3 = Rejected.find(value=>value.Name===User);
            const temp4 = Block.find(value=>value.Name===User);
            console.log(temp3);
            if(temp3){
                const id = temp3._id;
                const myid = JSON.stringify(id);
                const myidArr = myid.split('"');
                const finalid = myidArr[1];
                const time = new Date(parseInt(finalid.substring(0, 8), 16) * 1000);
                const diff = D - time;
                const noDays = diff/(1000*60*60*24);
                console.log(noDays);
                if(noDays<7) res.send("4");
                else{
                    if(temp2>=0) res.send("0");
                    else if(temp1) res.send("1");
                    else if(temp4) res.send("5");
                    else{
                        Gred.findOneAndUpdate({Name:Greddit},{$push:{
                            Requested:{
                                Name:User,
                                Email:EmailId
                            }
                        }},function (err,foundGred){
                            if(err) console.log(err);
                            else{
                                if(foundGred) res.send("2");
                                else res.send("3");
                            }
                        })
                    }
                }
            }
            else{
                if(temp2>=0) res.send("0");
                else if(temp1) res.send("1");
                else if(temp4) res.send("5");
                else{
                    Gred.findOneAndUpdate({Name:Greddit},{$push:{
                        Requested:{
                            Name:User,
                            Email:EmailId
                        }
                    }},function (err,foundGred){
                        if(err) console.log(err);
                        else{
                            if(foundGred) res.send("2");
                            else res.send("3");
                        }
                    })
                }
            }
        }
    })
})

// to get a greddit
app.post("/api/profile/GetGred",authenticate,function (req,res){
    Gred.findOne({Name:req.body.NameG},function (err,foundGred){
        if(err) console.log(err);
        else{
            if(foundGred) res.send(foundGred);
            else res.send("0");
        }
    })
})

// to get posts 
app.post("/api/profile/GetPosts",authenticate,function (req,res){
    const User = req.user.name;
    Gred.findOne({Name:req.body.NameG},function (err,foundGred){
        if(err) console.log(err);
        else{
            if(foundGred) {
                const Mod = foundGred.Moderator;
                const Block = foundGred.Blocked;
                const temp1 = Mod.indexOf(User);
                if(temp1===-1){
                    const PostN = foundGred.Post;
                    const len = PostN.length;
                    for(var i=0;i<len;i++) {
                        const PostedByUser = PostN[i].PostedBy;
                        const temp2 = Block.indexOf(PostedByUser);
                        if(temp2>=0) PostN[i].PostedBy = "Blocked User";
                    }
                    res.send(PostN);
                }
                else res.send(foundGred.Post);
            }
            else res.send("0");
        }
    })
})

// to post a post
app.post("/api/profile/PostGred",authenticate,function (req,res){
    const ToPostU = req.body.CurrUser;
    const ToFindG = req.body.NameG;
    const content = req.body.Content;
    const Keyword = req.body.Key;
    var ID = req.body.len;
    ID = ID + 1;
    const Arr = content.split(" ");
    var ToPostArr = [];
    const lowercaseWords = Keyword.map(word => word.toLowerCase());
    Arr.map((item)=>{
        const itemN = item.toLowerCase();
        const temp1 = lowercaseWords.indexOf(itemN);
        if(temp1>=0) ToPostArr.push("*");
        else ToPostArr.push(item);
    })
    const NewContent = ToPostArr.join(" ");
    Gred.findOneAndUpdate({Name:ToFindG},{$push:{
        Post:{
            UpVoted:[],
            DownVoted:[],
            Comment:[],
            PostedBy:ToPostU,
            Greddit:ToFindG,
            Description:NewContent,
            id:ID
        }
    }},function (err,foundGred){
        if(err) console.log(error);
        else{
            if(foundGred) res.send("1");
            else res.send("0");
        }
    })
})

// to up vote
app.post("/api/profile/Up",authenticate,function (req,res){
    const User = req.body.CurrUser;
    const Id = req.body.Id;
    const Name = req.body.Gred;
    console.log(User);
    Gred.findOne({Name:Name},function (err,foundGred){
        if(err) console.log(err);
        else{
            if(foundGred) {
                const PostN = foundGred.Post;
                console.log(PostN);
                const OnePost = PostN.find(item=>item.id==Id);
                const temp2 = OnePost.UpVoted.indexOf(User);
                if(temp2>=0) res.send("3");
                else{
                    OnePost.UpVoted.push(User);
                    const temp1 = OnePost.DownVoted.indexOf(User);
                    if(temp1>=0) OnePost.DownVoted.splice(temp1,1);
                    objIndex = PostN.findIndex((obj => obj.id == Id))
                    PostN[objIndex] = OnePost;
                    console.log(PostN);
                    Gred.findOneAndUpdate({Name:Name},{$set:{Post:PostN}},function (err,foundGred){
                        if(err) console.log(err);
                        else{
                            if(foundGred) res.send("1");
                            else res.send("2");
                        }
                    })
                }
            }
            else res.send("0");
        }
    })
})

// to down vote
app.post("/api/profile/Down",authenticate,function (req,res){
    const User = req.body.CurrUser;
    const Id = req.body.Id;
    const Name = req.body.Gred;
    Gred.findOne({Name:Name},function (err,foundGred){
        if(err) console.log(err);
        else{
            if(foundGred) {
                const PostN = foundGred.Post;
                console.log(PostN);
                const OnePost = PostN.find(item=>item.id==Id);
                const temp2 = OnePost.DownVoted.indexOf(User);
                if(temp2>=0) res.send("3");
                else{
                    OnePost.DownVoted.push(User);
                    const temp1 = OnePost.UpVoted.indexOf(User);
                    if(temp1>=0) OnePost.UpVoted.splice(temp1,1);
                    objIndex = PostN.findIndex((obj => obj.id == Id))
                    PostN[objIndex] = OnePost;
                    console.log(PostN);
                    Gred.findOneAndUpdate({Name:Name},{$set:{Post:PostN}},function (err,foundGred){
                        if(err) console.log(err);
                        else{
                            if(foundGred) res.send("1");
                            else res.send("0");
                        }
                    })
                }
            }
            else res.send("0");
        }
    })
})

// to follow the user
app.post("/api/profile/Follow",authenticate,function (req,res){
    console.log(req.body);
    if(req.body.UserToFollow===req.body.Follower) res.send("4");
    else{
        Cred.findOne({UserName:req.body.UserToFollow},function (err,foundCred){
            if(err) console.log(err);
            else{
                if(foundCred){
                    const NewArr = foundCred.Following;
                    const temp1 = NewArr.indexOf(req.body.Follower);
                    if(temp1>=0) res.send("2");
                    else{
                        Cred.findOneAndUpdate({UserName:req.body.UserToFollow},{$push:{
                            Following:req.body.Follower
                        }},function (err,foundCred){
                            if(err) console.log(err);
                            else{
                                if(foundCred) res.send("1");
                                else res.send("0");
                            }
                        })
                    }
                }
                else res.send("3");
            }
        })
    }
})

// to save the post in the user details
app.post("/api/profile/Save",authenticate,function (req,res){
    const User = req.user.name;
    console.log(req.body);
    Cred.findOne({UserName:User},function (err,foundCred){
        if(err) console.log(err);
        else{
            if(foundCred){
                const SavedF = foundCred.Saved;
                const temp1 = SavedF.filter((value)=>{return (value.GredName===req.body.Greddit&&value.GredId===req.body.Id)});
                if(temp1.length) res.send("2");
                else{
                    Cred.findOneAndUpdate({UserName:User},{$push:{
                        Saved:{
                            GredName:req.body.Greddit,
                            GredId:req.body.Id
                        }
                    }},function (err,foundCred){
                        if(err) console.log(err);
                        else{
                            if(foundCred) res.send("1");
                            else res.send("3")
                        }
                    })
                }
            }
            else res.send("0");
        }
    })
})

// to save a comment in a post
app.post("/api/profile/SaveComment",authenticate,function (req,res){
    const ToFindGred = req.body.Greddit;
    const ToFindPostId = req.body.Id;
    const ToPush = req.body.Des;
    if(ToPush.length===0) res.send("0");
    else{
        Gred.findOne({Name:ToFindGred},function (err,foundGred){
            if(err) console.log(err);
            else{
                if(foundGred){
                    const PostN = foundGred.Post;
                    const OnePost = PostN.find((item)=>{return item.id===ToFindPostId});
                    OnePost.Comment.push(ToPush);
                    console.log(OnePost);
                    objIndex = PostN.findIndex((obj => obj.id == ToFindPostId))
                    PostN[objIndex] = OnePost;
                    Gred.findOneAndUpdate({Name:ToFindGred},{$set:{Post:PostN}},function (err,foundGred){
                        if(err) console.log(err);
                        else{
                            if(foundGred) res.send("1");
                            else res.send("3");
                        }
                    })
                }
                else res.send("2");
            }
        })
    }
})

// to get the saved posts
app.post("/api/profile/GetSavedPosts",authenticate,function (req,res){
    const User = req.user.name;
    Cred.findOne({UserName:User},function (err,foundCred){
        if(err) console.log(err);
        else{
            if(foundCred) {
                const ToFind = foundCred.Saved;
                let PostN=[];
                Gred.find({},function (err,foundGreds){
                    if(err) console.log(err);
                    else{
                        if(foundGreds) {
                            const FGreds = foundGreds;
                            ToFind.map((item)=>{
                                const ToFindGredName = item.GredName;
                                const ToFindPostId = item.GredId;
                                const FoundGred = FGreds.find((item)=>{
                                    return item.Name===ToFindGredName;
                                })
                                const FoundPost = FoundGred.Post.filter((item)=>{ return item.id===ToFindPostId});
                                PostN.push(FoundPost);
                            })
                            res.send({Posts:PostN});
                        }
                        else res.send("2")
                    }
                })
            }
            else res.send("0");
        }
    })
})

// to unsave the post by the user
app.post("/api/profile/UnSavePost",authenticate,function (req,res){
    const User = req.user.name;
    console.log(req.body);
    const ToFindGred = req.body.GredName;
    const ToFindPost = req.body.PostId;
    Cred.findOneAndUpdate({UserName:User},{$pull:{
        Saved:{
            GredName:ToFindGred,
            GredId:ToFindPost
        }
    }},function (err,foundCred){
        if(err) console.log(err);
        else{
            if(foundCred) res.send("1");
            else res.send("0");
        }
    })
})

// to save the report 
app.post("/api/profile/AddReport",authenticate,function (req,res){
    const User = req.user.name;
    console.log(req.body);
    if(User===req.body.RepUser) res.send("2");
    else{
        Gred.findOne({Name:req.body.NameG},function (err,foundGred){
            if(err) console.log(err);
            else{
                if(foundGred){
                    const Mod = foundGred.Moderator;
                    const temp1 = Mod.indexOf(req.body.RepUser);
                    if(temp1>=0) res.send("3");
                    else{
                        Gred.findOneAndUpdate({Name:req.body.NameG},{$push:{
                            Report:{
                                ReportedBy:User,
                                ReportedUser:req.body.RepUser,
                                Concern:req.body.Content,
                                Text:req.body.Text,
                                State:0,
                                Touched:0,
                                Greddit:req.body.NameG,
                                id:req.body.id
                            }
                        }},function (err,foundGred){
                            if(err) console.log(err);
                            else{
                                if(foundGred) res.send("1");
                                else res.send("0");
                            }
                        })
                    }
                }
                else res.send("4")
            }
        })
        
    }
})

// to get the reports
app.post("/api/profile/GetReports",authenticate,function (req,res){
    const D = new Date();
    const ToFindUser = req.user.name;
    Gred.findOne({Name:req.body.Name},function (err,foundGred){
        if(err) console.log(err);
        else{
            if(foundGred){
                const Mod = foundGred.Moderator;
                const temp1 = Mod.indexOf(ToFindUser);
                if(temp1>=0){
                    const ReportN = foundGred.Report;
                    const ToSendReport = ReportN.filter((item)=>{
                        const id = item._id;
                        const myid = JSON.stringify(id);
                        const myidArr = myid.split('"');
                        const finalid = myidArr[1];
                        const time = new Date(parseInt(finalid.substring(0, 8), 16) * 1000);
                        const diff = D - time;
                        const noDays = diff/(1000*60*60*24);
                        console.log(noDays);
                        if(noDays<=10 || item.Touched) return 1;
                    })
                    Gred.findOneAndUpdate({Name:req.body.Name},{$set:{
                        Report:ToSendReport
                    }},function (err,foundGred){
                        if(err) console.log(err);
                        else{
                            if(foundGred)  res.send({FinalReports:ToSendReport,Mod:foundGred.Moderator});
                            else res.send("2");
                        }
                    })
                }
                else res.send("Not A Mod");
            }
            else res.send("0");
        }
    })
})

// to ignore the user
app.post("/api/profile/Ignore",authenticate,function (req,res){
    const ignore = req.body.ignore;
    if(ignore===0){
        Gred.findOne({Name:req.body.NameG},function (err,foundGred){
            if(err) console.log(err);
            else{
                if(foundGred){
                    const ReportN = foundGred.Report;
                    const OneReport = ReportN.find((item)=>{
                        const id = item._id;
                        const myid = JSON.stringify(id);
                        const myidArr = myid.split('"');
                        const finalid = myidArr[1];
                        return (finalid===req.body.id);
                    });
                    OneReport.State=1;
                    OneReport.Touched=1;
                    objIndex = ReportN.findIndex((obj => obj.id === req.body.id));
                    ReportN[objIndex] = OneReport;
                    Gred.findOneAndUpdate({Name:req.body.NameG},{$set:{
                        Report:ReportN
                    }},function (err,foundGred){
                        if(err) console.log(err);
                        else{
                            if(foundGred) res.send("1");
                            else res.send("0");
                        }
                    })
                }
                else res.send("2");
            }
        })
    }
    else if(ignore===1){
        Gred.findOne({Name:req.body.NameG},function (err,foundGred){
            if(err) console.log(err);
            else{
                if(foundGred){
                    const ReportN = foundGred.Report;
                    const OneReport = ReportN.find((item)=>{
                        const id = item._id;
                        const myid = JSON.stringify(id);
                        const myidArr = myid.split('"');
                        const finalid = myidArr[1];
                        return (finalid===req.body.id);
                    });
                    OneReport.State=0;
                    OneReport.Touched=1;
                    objIndex = ReportN.findIndex((obj => obj.id === req.body.id));
                    ReportN[objIndex] = OneReport;
                    Gred.findOneAndUpdate({Name:req.body.NameG},{$set:{
                        Report:ReportN
                    }},function (err,foundGred){
                        if(err) console.log(err);
                        else{
                            if(foundGred) res.send("1");
                            else res.send("0");
                        }
                    })
                }
                else res.send("2");
            }
        })
    }
})

// to delete the report
app.post("/api/profile/DeleteReport",authenticate,function (req,res){
    Gred.findOne({Name:req.body.NameG},function (err,foundGred){
        if(err) console.log(err);
        else{
            if(foundGred){
                const ReportN = foundGred.Report;
                const PostN = foundGred.Post;
                const OneReport = ReportN.filter((item)=>{
                    const id = item._id;
                    const myid = JSON.stringify(id);
                    const myidArr = myid.split('"');
                    const finalid = myidArr[1];
                    return (finalid!==req.body.id);
                });
                const OneReportFind = ReportN.find((item)=>{
                    const id = item._id;
                    const myid = JSON.stringify(id);
                    const myidArr = myid.split('"');
                    const finalid = myidArr[1];
                    return (finalid===req.body.id);
                })
                const PostToDeleteGred= OneReportFind.Greddit;
                const PostToDeleteId = OneReportFind.id;
                const OnePost = PostN.filter((item)=>{
                    return (item.Greddit!==PostToDeleteGred || item.id!==PostToDeleteId)
                });
                Gred.findOneAndUpdate({Name:req.body.NameG},{$set:{
                    Report:OneReport,
                    Post:OnePost
                }},function (err,foundGred){
                    if(err) console.log(err);
                    else{
                        if(foundGred) res.send("1");
                        else res.send("0");
                    }
                })
            }
            else res.send("2");
        }
    })
})

// to block the user (remove from joined , follower and into blocked array)
app.post("/api/profile/BlockUser",authenticate,function (req,res){
    const User = req.user.name;
    Gred.findOne({Name:req.body.NameG},function(err,foundGred){
        if(err) console.log(err);
        else{
            if(foundGred){
                const Mod = foundGred.Moderator;
                const Block = foundGred.Blocked;
                const temp2 = Block.indexOf(req.body.NameU);
                const temp1 = Mod.indexOf(req.body.NameU);
                if(temp1>=0) res.send("0");
                else if(temp2>=0) {
                    const ReportN = foundGred.Report;
                    const OneReport = ReportN.find((item)=>{
                        const id = item._id;
                        const myid = JSON.stringify(id);
                        const myidArr = myid.split('"');
                        const finalid = myidArr[1];
                        return (finalid===req.body.id);
                    });
                    OneReport.State=2;
                    OneReport.Touched=1;
                    objIndex = ReportN.findIndex((obj => obj.id === req.body.id));
                    ReportN[objIndex] = OneReport;
                    Gred.findOneAndUpdate({Name:req.body.NameG},{
                        $set:{
                            Report:ReportN
                        },
                    },function (err,foundGred){
                        if(err) console.log(err);
                        else{
                            if(foundGred) res.send("4");
                            else res.send("5");
                        }
                    })
                }
                else{
                    const ReportN = foundGred.Report;
                    const OneReport = ReportN.find((item)=>{
                        const id = item._id;
                        const myid = JSON.stringify(id);
                        const myidArr = myid.split('"');
                        const finalid = myidArr[1];
                        return (finalid===req.body.id);
                    });
                    OneReport.State=2;
                    OneReport.Touched=1;
                    objIndex = ReportN.findIndex((obj => obj.id === req.body.id));
                    ReportN[objIndex] = OneReport;
                    Gred.findOneAndUpdate({Name:req.body.NameG},{
                        $set:{
                            Report:ReportN
                        },
                        $pull:{
                            Follower:req.body.NameU,
                            Joined:req.body.NameU
                        },
                        $push:{
                            Blocked:req.body.NameU
                        }
                    },function (err,foundGred){
                        if(err) console.log(err);
                        else{
                            if(foundGred) res.send("1");
                            else res.send("2");
                        }
                    })
                }
            }
            else res.send("3");
        }
    })
})

// to authenticate the user
function authenticate(req,res,next){
    const TokToAuth = req.body.accessToken;
    if(TokToAuth==null) res.send("NoToken") // here no token is given (local storage will take care of this)
    jwt.verify(TokToAuth,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) res.send("ChangeInToken") // here there is some change in token
        req.user = user
        next();
    })  
} 






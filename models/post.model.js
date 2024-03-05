const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type :String,
        required:true,
    },
    title : {
        type:String,
        required : true,
        unique : true,
    },
    category : {
        type : String,
        default : 'uncategorized'
    },
    imageUrl : {
        type : String ,
        default : 'https://images.unsplash.com/photo-1500989145603-8e7ef71d639e?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    content : {
        type : String,
        required : true,
    },
    slug : {
        type : String,
        required : true,
        unique : true
    }
},{timestamp : true})

const Post = mongoose.model("Post",postSchema)

module.exports = Post
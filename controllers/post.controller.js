const Post = require('../models/post.model')


const create = async (req,res)=>{
    if(!req.body.isAdmin){
        return res.status(400).json({
            error : "You are not allowed to create a post"
        })
    }
    if(!req.body.title || !req.body.content){
        return res.status(400).json({
            error : "Please provide required fields"
        })
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'-')
    const newPost = new Post({
        ...req.body,slug,userId : req.user.id
    })

    await newPost.save();

    return res.status(201).json({
        data : newPost
    })
}

module.exports = {
    create
}
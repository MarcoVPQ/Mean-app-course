const Post = require('../models/post')


exports.getPosts = (req, res) => {
    //Getting query params
    const pageSize = parseInt(req.query.pagesize)
    const currentPage = parseInt(req.query.page)
    const postQuery = Post.find()
    let posts;

    if(pageSize && currentPage){
      postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
    }

    ///Fetching doc
    postQuery
    .then( docs => {
        posts = docs
        return Post.countDocuments()
    })
    .then(count => {
        res.status(200).json({
            message: 'Posts fetched successfully',
            posts,
            maxPosts: count
        })
    })
    .catch( e => res.status(500).json({message: 'Posts not fetched'}))

}

exports.getPostById = (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if(!post){
                res.status(404).json({
                    message: `No post Found`
                })
            }else{
                //console.log(post)
                res.status(200).json(post)
            }
        })
        .catch( e => res.status(500).json({message: 'Post not fetched'}))
}


exports.addPost = (req, res) => {

    //console.log(req.body)
    const url = `${req.protocol}://${req.get("host")}`    
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imgPath: `${url}/uploads/${req.file.filename}`,
        creator: req.user._id

    })
    //console.log(post)
    post.save().then( newPost => {

        //console.log(newPost)
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                ...newPost,
                id: newPost._id
            }
        })
    })
    .catch( e => res.status(500).json({message: 'Post not created'}))
   
}

exports.deletePost =  (req, res) => {
   
    Post.deleteOne({_id: req.params.id, creator: req.user._id })
    .then((result ) => {
        
        if(result.n > 0){
            res.status(200).json({message: `Delition successful`})
        } else{
            res.status(401).json({ message: 'Unauthorize'})
        }
    })
    .catch(e => res.send(e))
 
}

exports.updatePost = (req , res) => {
    let imgPath = req.body.imgPath 
   if(req.file){
     const url = `${req.protocol}://${req.get("host")}`
     imgPath = `${url}/uploads/${req.file.filename}`    
   }  
 const post = {
     title: req.body.title,
     content: req.body.content,
     imgPath
 }

 //console.log(post)
 Post.updateOne({ _id: req.params.id, creator: req.user._id}, post)
     .then(result => {
         if(result.n > 0){
             res.status(200).json({message: `Update successful`})
         } else{
             res.status(401).json({ message: 'Unauthorize'})
         }
     })
     .catch( e => res.status(500).json({message: 'Post not created'}))

}
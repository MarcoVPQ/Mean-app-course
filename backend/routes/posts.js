const Router = require('express').Router()
const Post = require('../models/post')
const multer = require('multer')

const checkToken = require('../middlewares/check-token')

const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpeg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype]
        let err = new Error("Invalid mime type")

        if(isValid){
            err = null
        }
        cb(err, "backend/uploads")
    },
    filename: (req, file, cb) => {
        const name = file.originalname
        .toLowerCase()
        .split(' ')
        .join('-')
        const ext = MIME_TYPE_MAP[file.mimetype]
        cb(null, `${name}-${Date.now()}.${ext}`)
    }
})

Router.get("",(req, res) => {
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

   
})

Router.get('/:id', (req, res) => {
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
})

Router.post('',
   checkToken,
   multer({storage}).single('file'),
    (req, res) => {

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
   
})

Router
.delete('/:id',
 checkToken, 
 (req, res) => {
   
    Post.deleteOne({_id: req.params.id, creator: req.user._id })
    .then((result ) => {
        
        if(result.n > 0){
            res.status(200).json({message: `Delition successful`})
        } else{
            res.status(401).json({ message: 'Unauthorize'})
        }
    })
    .catch(e => res.send(e))
 
})

Router
.put('/:id',
    checkToken, 
    multer({storage}).single('file')
    ,(req , res) => {
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
            if(result.nModified > 0){
                res.status(200).json({message: `Update successful`})
            } else{
                res.status(401).json({ message: 'Unauthorize'})
            }
        })
        .catch( e => res.status(500).json({message: 'Post not created'}))

})

module.exports = Router;
const Router = require('express').Router()

const PostsController = require('../controllers/posts')
const checkToken = require('../middlewares/check-token')
const fileHandler = require('../middlewares/upload')


Router.get("", PostsController.getPosts)
Router.get('/:id', PostsController.getPostById)
Router.post('', checkToken, fileHandler, PostsController.addPost)
Router.delete('/:id', checkToken, PostsController.deletePost)
Router.put('/:id', checkToken, fileHandler , PostsController.updatePost)



module.exports = Router;
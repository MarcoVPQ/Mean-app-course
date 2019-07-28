const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/myapp')
.then(() => console.log(`Connected`))
.catch((e) => console.log(e))
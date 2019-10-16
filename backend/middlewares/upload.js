const multer = require('multer')

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


module.exports = multer({storage}).single('file')
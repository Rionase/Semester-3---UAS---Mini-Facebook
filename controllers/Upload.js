import multer from 'multer';
import fs from "fs";
import path from 'path';


let storage = multer.diskStorage( {
    destination: (req, file, cb) => {
        let foldername = `public/user_data/${req.session.user.username}`
        if ( !fs.existsSync( foldername ) ) {
            fs.mkdirSync( foldername );
        }
        cb(null, foldername)
    },
    filename: (req, file, cb) => {
        let filename = Date.now() + path.extname(file.originalname)
        req.image_path_name = `/user_data/${req.session.user.username}/${filename}`
        cb(null, filename )
    }
})

let upload = multer({ storage: storage })

export default upload;
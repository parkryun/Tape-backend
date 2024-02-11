const multer = require('multer'); //이미지

function createImageStorageConfig(){
    const storageConfig = multer.diskStorage({
        destination: function(req,file,cb){
            cb(null, 'images');
        },
        filename: function(req,file,cb){
            cb(null, Date.now() + '-' + file.originalname);
        },
    })
    return multer({storage: storageConfig});
}

module.exports = createImageStorageConfig;
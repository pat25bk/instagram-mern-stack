const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const unLinkAsync = promisify(fs.unlink);

const deleteFile = async(dirpath,filename)=>{
    await unLinkAsync(path.join(__dirname,'../public/uploads/',dirpath)+filename);
}

module.exports = deleteFile
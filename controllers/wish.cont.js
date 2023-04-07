const { unlink } = require('fs')
const cloudinary = require('cloudinary')
const Wish = require('../models/Wish');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const addWish = async (req, res, next) => {
    let wish_info = req.body;
    try {
        if(req.file) {
            const tempPath = req.file.path;
            await cloudinary.v2.uploader.upload(
                tempPath,
                async function(error, result){
                    wish_info["image"] = result.url;
                    wish_info["imageId"] = result.public_id;
                    unlink(tempPath, (err) => {
                        if (err) console.log(err);
                    });
                }
            )
        }
        wish_info["user"]= req.user.aud
        console.log(wish_info)
        
        const temp_wish = new Wish(wish_info);
        const wish = await temp_wish.save();
        res.status(200).json({
            message: 'Wish created successfully',
            wish
        })
    }
    catch(err) {
        next(err);
    }
}

const getAllWishes = async (req, res, next) => {
    try {
        const wishes = await Wish.find();
        res.status(200).json({
            message: 'Wishes fetched successfully',
            wishes
        })
    }
    catch(err) {
        next(err);
    }
}

const getUsersWish = async (req, res, next) => {
    try {
        const wish = await Wish.find({user: req.user.aud});
        // for(let i=0; i<wish.length; i++){
        //     if(req.user.aud != wish[i].user) throw new Error('Unauthorized access');
        // }
        res.status(200).json({
            message: 'Wish fetched successfully',
            wish
        })
    }
    catch(err) {
        next(err);
    }
}

const deleteWish = async (req, res, next) => {
    try {
        const wish = await Wish.findById(req.params.id);
        if(req.user.aud !== wish.user.toString()) throw new Error('Unauthorized access');
        await Wish.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: 'Wish deleted successfully'
        })
    }
    catch(err) {
        next(err);
    }
}

module.exports = {
    addWish, getAllWishes, getUsersWish, deleteWish
}
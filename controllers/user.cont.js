const { unlink } = require('fs')
const Income = require("../models/Income");
const User = require("../models/User");
const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const getUserDetail = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.aud);
        res.status(200).json({
            message: 'User fetched successfully',
            user
        })
    }
    catch(err) {
        next(err);
    }
}

const getUserDetailByEmail = async(req, res, next) => {
    try {
        const user = await User.findOne({email: req.params.email});
        res.status(200).json({
            message: 'User fetched successfully',
            user
        })
    }
    catch(err) {
        next(err);
    }
}

const setIncome = async(req, res, next) => {
    const { monthlySalary, estimatedSaving, receiveDate } = req.body;
    try {
        const income = new Income({
            monthlySalary,
            estimatedSaving,
            receiveDate,
            user: req.user.aud
        })
        income.year = new Date().getFullYear();
        income.month = new Date().getMonth() + 1;

        await income.save();
        
        res.status(200).json({
            message: 'Income info set successfully',
            income
        })
    }
    catch(err) {
        next(err);
    }
}

const additionalIncome = async (req, res, next) => {
    const { additional } = req.body;
    try {
        const user = await User.findById(req.user.aud);
        user.balance += additional;
        await user.save();
        res.status(200).json({
            message: 'Additional income added successfully',
            user
        })
    }
    catch(err) {
        next(err);
    }
}

const profileImage = async(req, res, next)=>{
    let image = {img_url: "", img_key: ""}
    try {
        if(req.file) {
            const tempPath = req.file.path;
            await cloudinary.v2.uploader.upload(
                tempPath,
                async function(error, result){
                    image["img_url"] = result.url;
                    image["img_key"] = result.public_id;
                    unlink(tempPath, (err) => {
                        if (err) console.log(err);
                    });
                }
            )
        }
        const user = await User.findById(req.user.aud)
        if(user.image.img_key){
            await cloudinary.v2.uploader.destroy(user.image.img_key)
        }

        const usr = await user.updateOne({image})
        

        res.status(200).json({
            message: 'User image updated successfully',
        })
    }
    catch(err) {
        next(err);
    }  
}

const updateInfo = async(req, res, next)=>{
    const {name} = req.body

    try{
        const user = await User.findByIdAndUpdate(req.user.aud, {name})

        res.status(200).json({
            message: 'User information updated successfully',
        })


    }catch(err){
        next(err)
    }
}

module.exports = { getUserDetail, getUserDetailByEmail, setIncome, additionalIncome, profileImage, updateInfo }
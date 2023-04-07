const express = require('express');
const multer = require('multer');

const userController = require('../controllers/user.cont');
const { verify_user } = require('../middleware/auth.middleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Image');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
})
const upload = multer({ storage: storage });

const router = express.Router();

router.get('/', verify_user, userController.getUserDetail);
router.get('/:email', userController.getUserDetailByEmail);
router.post('/income', verify_user, userController.setIncome);
router.put('/additional',verify_user, userController.additionalIncome);
router.put('/profile_image', verify_user, upload.single('image'), userController.profileImage)
router.put('/info', verify_user, userController.updateInfo)

module.exports = router;
const express = require('express');
const multer = require('multer');

const wishController = require('../controllers/wish.cont');
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

router.route('/')
    .get(verify_user, wishController.getUsersWish)
    .post(verify_user, upload.single('image'), wishController.addWish)
    .put((req, res) => { res.status(200).json({ message: 'Feature not implemented' }) })
    .delete((req, res) => { res.status(200).json({ message: 'Feature not implemented' }) });

router.route('/:id')
    .get((req, res) => { res.status(200).json({ message: 'Feature not implemented' }) })
    .post((req, res) => { res.status(200).json({ message: 'Feature not implemented' }) })
    .put((req, res) => { res.status(200).json({ message: 'Feature not implemented' }) })
    .delete(verify_user, wishController.deleteWish);

module.exports = router;
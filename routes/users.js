const express = require('express');
const db = require('../data/database');
// initialize multer package
const router = express.Router();
const multer = require('multer');
//
const storageCofig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (res, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
})
const upload = multer({ storage: storageCofig });
router.get('/',async function (req, res) {
  const users = await db.getDb().collection('users').find().toArray();
  res.render('profiles', {users: users});
});

router.get('/new-user', function (req, res) {
  res.render('new-user');
});
// add upload additional middleware "upload" from multer package.
// uses: const upload = multer();
router.post('/profiles', upload.single('image'), async function (req, res) {
  const uploadedImage = req.file;
  const userData = req.body;
  console.log(uploadedImage);
  console.log(userData);
  await db
    .getDb()
    .collection('users')
    .insertOne({
      name: userData.username,
      imagePath: uploadedImage.path,
    });
  res.redirect('/');
})

module.exports = router;
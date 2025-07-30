const express = require('express');
const router = express.Router();
const biodataController = require('../controllers/controller.biodata');
const upload = require('../middleware/uploadMiddleware');
const authGuru = require('../middleware/authGuru');

router.get('/', authGuru, biodataController.getAllBiodata);
router.get('/:id', biodataController.getBiodataById);
router.get('/user/:userId', biodataController.getBiodataByUserId);
router.post('/', upload.single('foto_profil'), biodataController.createBiodata);
router.put('/:id', upload.single('foto_profil'), biodataController.updateBiodata);
router.delete('/:id', authGuru, biodataController.deleteBiodata);

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/controller.user'); // sesuaikan path


router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser); // tambah route update
router.delete('/:id', userController.deleteUser);
router.post('/login', userController.login); // Tambahkan route login di bawah ini

module.exports = router; // export router

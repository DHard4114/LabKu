const userRepo = require('../repositories/repository.user');
const databaseResponse = require('../utils/databaseResponse');
const userHelper = require('../utils/userHelper');
const jwt = require('jsonwebtoken');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userRepo.getAllUsers();
        return databaseResponse.success(res, users, 'Users fetched successfully');
    } catch (error) {
        return databaseResponse.error(res, error, 'Failed to fetch users');
    }
}

exports.createUser = async (req, res) => {
    const { name, email, password, role } = req.body; // pastikan ada name
    try {
        if (!userHelper.isValidEmail(email)) {
            return databaseResponse.validationError(res, null, 'Email tidak valid');
        }

        const hashedPassword = await userHelper.hashPassword(password);

        const userData = { name, email, password: hashedPassword, role };
        const user = await userRepo.createUser(userData);
        return databaseResponse.success(res, user, 'User created', 201);
    } catch (error) {
        return databaseResponse.error(res, error, 'Failed to create user');
    }
}
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userRepo.getUserById(id);
        if (!user) {
            return databaseResponse.notFound(res, 'User not found');
        }
        return databaseResponse.success(res, user, 'User fetched successfully');
    } catch (error) {
        return databaseResponse.error(res, error, 'Failed to fetch user');
    }
}

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const userData = req.body;
    try {
        const updatedUser = await userRepo.updateUser(id, userData);
        if (!updatedUser) {
            return databaseResponse.notFound(res, 'User not found');
        }
        return databaseResponse.success(res, updatedUser, 'User updated successfully');
    } catch (error) {
        return databaseResponse.error(res, error, 'Failed to update user');
    }
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await userRepo.deleteUser(id);
        if (!deletedUser) {
            return databaseResponse.notFound(res, 'User not found');
        }
        return databaseResponse.success(res, deletedUser, 'User deleted successfully');
    } catch (error) {
        return databaseResponse.error(res, error, 'Failed to delete user');
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!userHelper.isValidEmail(email)) {
            return databaseResponse.validationError(res, null, 'Email tidak valid');
        }

        const user = await userRepo.getUserByEmail(email);
        if (!user) return databaseResponse.notFound(res, 'User not found');

        const match = await userHelper.comparePassword(password, user.password);
        if (!match) return databaseResponse.unauthorized(res, 'Invalid password');

        // Buat token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        delete user.password;
        return databaseResponse.success(res, { user, token }, 'Login success');
    } catch (error) {
        return databaseResponse.error(res, error, 'Login failed');
    }
};


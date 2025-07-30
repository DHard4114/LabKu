const db = require('../database/db.js')

exports.getAllUsers = async () => {
    try {
        const result = await db.query('SELECT * FROM users');
        return result.rows;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

exports.createUser = async (userData) => {
    const { name, email, password, role } = userData;
    try {
        const result = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, password, role]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

exports.getUserById = async (id) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
}

exports.getUserByEmail = async (email) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw error;
    }
}

exports.updateUser = async (id, userData) => {
    const { name, email, password } = userData;
    try {
        const result = await db.query(
            'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
            [name, email, password, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

exports.deleteUser = async (id) => {
    try {
        const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}
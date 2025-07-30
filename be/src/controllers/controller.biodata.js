const biodataRepo = require('../repositories/repository.biodata');
const response = require('../utils/databaseResponse');

exports.getAllBiodata = async (req, res) => {
    try {
        const data = await biodataRepo.getAllBiodata();
        return response.success(res, data, 'Biodata fetched');
    } catch (error) {
        return response.error(res, error, 'Failed to fetch biodata');
    }
};

exports.getBiodataById = async (req, res) => {
    try {
        const data = await biodataRepo.getBiodataById(req.params.id);
        if (!data) return response.notFound(res, 'Biodata not found');
        return response.success(res, data, 'Biodata found');
    } catch (error) {
        return response.error(res, error, 'Failed to fetch biodata');
    }
};

exports.getBiodataByUserId = async (req, res) => {
    try {
        const data = await biodataRepo.getBiodataByUserId(req.params.userId);
        if (!data) return response.notFound(res, 'Biodata not found for this user');
        return response.success(res, data, 'Biodata found for user');
    } catch (error) {
        return response.error(res, error, 'Failed to fetch biodata for user');
    }
};

exports.createBiodata = async (req, res) => {
    try {
        // Jika upload file, gunakan req.file.path untuk foto_profil
        const biodata = { ...req.body, foto_profil: req.file ? req.file.path : null };
        const data = await biodataRepo.createBiodata(biodata);
    
        console.log('user_id:', req.body.user_id); // DEBUG
        
        return response.success(res, data, 'Biodata created', 201);
    } catch (error) {
        return response.error(res, error, 'Failed to create biodata');
    }
};


exports.updateBiodata = async (req, res) => {
    try {
        const biodata = { ...req.body, foto_profil: req.file ? req.file.path : null };
        const data = await biodataRepo.updateBiodata(req.params.id, biodata);
        if (!data) return response.notFound(res, 'Biodata not found');
        return response.success(res, data, 'Biodata updated');
    } catch (error) {
        return response.error(res, error, 'Failed to update biodata');
    }
};

exports.deleteBiodata = async (req, res) => {
    try {
        const data = await biodataRepo.deleteBiodata(req.params.id);
        if (!data) return response.notFound(res, 'Biodata not found');
        return response.success(res, data, 'Biodata deleted');
    } catch (error) {
        return response.error(res, error, 'Failed to delete biodata');
    }
};
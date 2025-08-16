const centerModel = require('../models/center.model');

const createCenter = async (data) => {
    try {
        return await centerModel.addCenter(data);
    } catch (error) {
        console.error('[CenterService] حدث خطأ أثناء إضافة المركز:', error.message);
        throw new Error('حدث خطأ أثناء إضافة المركز');
    }
};

const fetchAllCenters = async (user_id) => {
    try {
        return await centerModel.getAllcenters(user_id);
    } catch (error) {
        console.error('[CenterService] Failed to fetch all centers:', error.message);
        throw new Error('Failed to fetch centers');
    }
};

const getCenterById = async (id, user_id) => {
    try {
        return await centerModel.getCenterById(id, user_id);
    } catch (error) {
        console.error(`[CenterService] Failed to fetch center with ID ${id}:`, error.message);
        throw new Error('السنتر غير موجود');
    }
};

const updateCenter = async (id, data) => {
    try {
        return await centerModel.updateCenter(id, data);
    } catch (error) {
        console.error(`[CenterService] Failed to update center with ID ${id}:`, error.message);
        throw new Error('حدث خطأ أثناء تحديث السنتر');
    }
};

const deleteCenter = async (id, user_id) => {
    try {
        return await centerModel.deleteCenter(id, user_id);
    } catch (error) {
        console.error(`[CenterService] Failed to delete center with ID ${id}:`, error.message);
        throw new Error('حدث خطأ أثناء حذف السنتر');
    }
};

module.exports = {
    createCenter,
    fetchAllCenters,
    getCenterById,
    updateCenter,
    deleteCenter
};

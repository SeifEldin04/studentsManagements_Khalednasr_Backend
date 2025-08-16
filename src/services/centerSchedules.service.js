const centerSchedulesModel = require('../models/centerSchedules.model');

// إضافة جدول مواعيد لمركز
const addCenterSchedule = async (data) => {
    try {
        return await centerSchedulesModel.createCenterSchedule(data);
    } catch (error) {
        console.error('[CenterScheduleService] حدث خطأ أثناء إضافة ميعاد الحصة :', error.message);
        throw error;
    }
};

// جلب كل جداول المواعيد لمستخدم معيّن
const getAllCenterSchedules = async (user_id) => {
    try {
        return await centerSchedulesModel.getAllCenterSchedules(user_id);
    } catch (error) {
        console.error('[CenterScheduleService] Failed to get all center schedules:', error.message);
        throw error;
    }
};

// جلب جداول مركز معين بناءً على center_id و user_id
const getCenterSchedulesByCenter = async (center_id, user_id) => {
    try {
        return await centerSchedulesModel.getCenterScheduleByCenterId(center_id, user_id);
    } catch (error) {
        console.error('[CenterScheduleService] Failed to get center schedule by center ID:', error.message);
        throw error;
    }
};

// تعديل جدول معين حسب ID
const updateCenterSchedule = async (id, data) => {
    try {
        return await centerSchedulesModel.updateCenterSchedule(id, data);
    } catch (error) {
        console.error('[CenterScheduleService] حدث خطأ أثناء تحديث ميعاد الحصة :', error.message);
        throw error;
    }
};

// حذف جدول مركز معيّن
const deleteCenterSchedule = async (id, user_id) => {
    try {
        return await centerSchedulesModel.deleteCenterSchedule(id, user_id);
    } catch (error) {
        console.error('[CenterScheduleService] حدث خطأ أثناء حذف ميعاد الحصة :', error.message);
        throw error;
    }
};

module.exports = {
    addCenterSchedule,
    getAllCenterSchedules,
    getCenterSchedulesByCenter,
    updateCenterSchedule,
    deleteCenterSchedule
};

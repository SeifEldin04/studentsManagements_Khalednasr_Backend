const centerSchedulesService = require('../services/centerSchedules.service');
const client = require('../../db');
const httpStatusText = require('../utils/httpStatusText');

const createCenterSchedule = async (req, resp) => {
    try {

        const data = {
            ...req.body,
            user_id: req.user.id // Adding user_id from token to the data
        };

        const centerSchedule = await centerSchedulesService.addCenterSchedule(data);
        resp.status(201).json({ status: httpStatusText.SUCCESS, data: { centerSchedule } });
    } catch (error) {
        console.error('حدث خطأ أثناء إضافة ميعاد الحصة', error);
        resp.status(500).json({ status: httpStatusText.FAIL, message: 'حدث خطأ أثناء إضافة ميعاد الحصة', error: error.message });
    }
}

const getAllCenterSchedules = async (req, resp) => {
    try {
        const centerSchedules = await centerSchedulesService.getAllCenterSchedules(req.user.id);
        resp.status(200).json({ status: httpStatusText.SUCCESS, data: { centerSchedules } });
    } catch (error) {
        console.error('Error Fetching all center schedules', error);
        resp.status(500).json({ status: httpStatusText.FAIL, message: 'Error Fetching all center schedules', error: error.message });
    }
}

const getCenterScheduleByCenterId = async (req, resp) => {
    try {
        const centerSchedule = await centerSchedulesService.getCenterSchedulesByCenter(req.params.center_id, req.user.id);
        resp.status(200).json({ status: httpStatusText.SUCCESS, data: { centerSchedule } });
    } catch (error) {
        console.error('Error Get specific center schedules', error);
        resp.status(500).json({ status: httpStatusText.FAIL, message: 'Error Get specific center schedules', error: error.message });
    }
}

const updateCenterSchedule = async (req, resp) => {
    try {

        const data = {
            ...req.body,
            user_id: req.user.id // Adding user_id from token to the data
        };

        const centerScheduleUpdated = await centerSchedulesService.updateCenterSchedule(req.params.id, data);
        resp.status(200).json({ status: httpStatusText.SUCCESS, data: { centerScheduleUpdated } });
    } catch (error) {
        console.error('حدث خطأ أثناء تحديث ميعاد الحصة', error);
        resp.status(500).json({ status: httpStatusText.FAIL, message: 'حدث خطأ أثناء تحديث ميعاد الحصة', error: error.message });
    }
}

const deleteCenterSchedule = async (req, resp) => {
    try {
        await centerSchedulesService.deleteCenterSchedule(req.params.id, req.user.id);
        resp.status(200).json({ status: httpStatusText.SUCCESS, message: "تم حذف ميعاد الحصة بنجاح" })
    } catch (error) {
        console.error('خطأ في حذف ميعاد الحصة المحدد', error);
        resp.status(500).json({ status: httpStatusText.FAIL, message: 'خطأ في حذف ميعاد الحصة المحدد', error: error.message });
    }
}

module.exports = {
    createCenterSchedule,
    getAllCenterSchedules,
    getCenterScheduleByCenterId,
    updateCenterSchedule,
    deleteCenterSchedule
}
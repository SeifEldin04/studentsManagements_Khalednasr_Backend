const centerService = require('../services/center.service');
const httpStatusText = require('../utils/httpStatusText');

const createCenter = async (req, res) => {
    try {
        const data = {
            ...req.body,
            user_id: req.user.id
        };
        const center = await centerService.createCenter(data);
        res.status(201).json({
            status: httpStatusText.SUCCESS,
            data: { center }
        });
    } catch (error) {
        console.error('[CenterController] حدث خطأ أثناء إضافة السنتر:', error.message);
        res.status(500).json({
            status: httpStatusText.FAIL,
            message: 'حدث خطأ أثناء إضافة السنتر',
            error: error.message
        });
    }
};

const getAllCenters = async (req, res) => {
    try {
        const centers = await centerService.fetchAllCenters(req.user.id);
        res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: { centers }
        });
    } catch (error) {
        console.error('[CenterController] Error fetching centers:', error.message);
        res.status(500).json({
            status: httpStatusText.FAIL,
            message: 'Error fetching centers',
            error: error.message
        });
    }
};

const getCenterById = async (req, res) => {
    try {
        const center = await centerService.getCenterById(req.params.id, req.user.id);
        res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: { center }
        });
    } catch (error) {
        console.error('[CenterController] Error fetching center by ID:', error.message);
        res.status(500).json({
            status: httpStatusText.FAIL,
            message: 'Error fetching center by ID',
            error: error.message
        });
    }
};

const updateCenter = async (req, res) => {
    try {
        const data = {
            ...req.body,
            user_id: req.user.id
        };
        const updatedCenter = await centerService.updateCenter(req.params.id, data);
        res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: { center: updatedCenter }
        });
    } catch (error) {
        console.error('[CenterController] حدث خطأ أثناء تحديث السنتر:', error.message);
        res.status(500).json({
            status: httpStatusText.FAIL,
            message: 'حدث خطأ أثناء تحديث السنتر',
            error: error.message
        });
    }
};

const deleteCenter = async (req, res) => {
    try {
        await centerService.deleteCenter(req.params.id, req.user.id);
        res.status(200).json({
            status: httpStatusText.SUCCESS,
            message: 'تم حذف السنتر بنجاح'
        });
    } catch (error) {
        console.error('[CenterController] حدث خطأ أثناء حذف السنتر :', error.message);
        res.status(500).json({
            status: httpStatusText.FAIL,
            message: 'حدث خطأ أثناء حذف السنتر',
            error: error.message
        });
    }
};

module.exports = {
    createCenter,
    getAllCenters,
    getCenterById,
    updateCenter,
    deleteCenter
};

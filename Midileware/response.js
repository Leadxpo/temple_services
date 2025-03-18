const successResponse = (res, message, data = null) => {
    return res.status(200).json({
        success: true,
        message,
        data,
        error: null,
    });
};

const errorResponse = (res, message, error = null, statusCode = 400) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error,
    });
};

module.exports = {
    successResponse,
    errorResponse,
};

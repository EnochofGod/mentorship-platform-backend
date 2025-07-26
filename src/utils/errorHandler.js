const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    // Log error details for debugging (stack in non-production)
    if (process.env.NODE_ENV !== 'production') {
        console.error('Error:', err.message);
        if (err.stack) console.error(err.stack);
    } else {
        // In production, log minimal info
        console.error('Error:', err.message);
    }
    res.status(statusCode).json({
        message: err.message || 'An unexpected error occurred.',
        errors: err.errors || undefined,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
};

module.exports = errorHandler;
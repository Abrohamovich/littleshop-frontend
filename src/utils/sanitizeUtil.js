export const sanitizeFormData = (data) => {
    const sanitized = {};
    Object.keys(data).forEach(key => {
        const value = data[key];
        sanitized[key] = (typeof value === 'string' && value.trim() === '') ? null : value;
    });
    return sanitized;
};
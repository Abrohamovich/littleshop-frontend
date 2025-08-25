export default class ApiError extends Error {
    constructor(status, message, timestamp) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.timestamp = timestamp;
    }
}

export const handleResponse = async (response) => {
    if (!response.ok) {
        let errorData = null;
        let errorText = '';

        try {
            errorText = await response.text();
            console.log('Raw error response:', errorText);

            if (errorText) {
                errorData = JSON.parse(errorText);
                console.log('Parsed error data:', errorData);
            }
        } catch (parseError) {
            console.log('Failed to parse error response as JSON:', parseError)
        }

        if (errorData) {
            if (errorData.status && errorData.message && errorData.timestamp) {
                console.log('Using ErrorResponse format');
                throw new ApiError(errorData.status, errorData.message, errorData.timestamp);
            }

            if (typeof errorData === 'object' && !errorData.status && !errorData.message) {
                console.log('Using validation error format');
                const validationMessages = Object.entries(errorData)
                    .map(([field, message]) => `${field}: ${message}`)
                    .join(', ');
                throw new ApiError(response.status, `Validation failed: ${validationMessages}`, new Date().toISOString());
            }

            if (errorData.message) {
                console.log('Using message field from error data');
                throw new ApiError(response.status, errorData.message, errorData.timestamp || new Date().toISOString());
            }

            console.log('Using fallback JSON error handling');
            throw new ApiError(response.status, JSON.stringify(errorData), new Date().toISOString());
        } else {
            console.log('Using raw text error');
            throw new ApiError(response.status, errorText || `HTTP error! status: ${response.status}`, new Date().toISOString());
        }
    }

    return response.json();
};
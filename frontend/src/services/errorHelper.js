export function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
    const data = err.response?.data;

    if (typeof data === 'string') return data;
    if (data?.error) return data.error;
    if (data?.errors) {
        const firstKey = Object.keys(data.errors)[0];
        return data.errors[firstKey][0];
    }
    if (data?.title) return data.title;

    return fallback;
}
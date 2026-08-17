import axios from 'axios';

// Use relative URLs to leverage the proxy in package.json
const apiClient = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        if (error.response) {
            // Server responded with error status
            console.error('Response error:', error.response.data);
        } else if (error.request) {
            // Request made but no response
            console.error('No response received');
        } else {
            // Something else happened
            console.error('Request setup error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;

import axiosInstance from './axiosInstance';

export const registerUser = async (userData) => {
    const { data } = await axiosInstance.post('/auth/register', userData);
    return data;
};

export const loginUser = async (userData) => {
    const { data } = await axiosInstance.post('/auth/login', userData);
    return data;
};

export const verifyOTP = async (otpData) => {
    const { data } = await axiosInstance.post('/auth/verify-otp', otpData);
    return data;
};

export const forgetPassword = async (email) => {
    const { data } = await axiosInstance.post('/auth/forget-password', { email });
    return data;
};

export const resetPassword = async (resetData) => {
    const { data } = await axiosInstance.post('/auth/reset-password', resetData);
    return data;
};

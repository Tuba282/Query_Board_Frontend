import axiosInstance from './axiosInstance';

export const getUserProfile = async () => {
    const { data } = await axiosInstance.get('/users/profile');
    return data;
};

export const updateUserProfile = async (formData) => {
    const { data } = await axiosInstance.put('/users/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

export const deleteUserAccount = async () => {
    const { data } = await axiosInstance.delete('/users/profile');
    return data;
};

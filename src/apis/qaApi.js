import axiosInstance from './axiosInstance';

export const getBoardQuestions = async () => {
    const { data } = await axiosInstance.get('/qa/board');
    return data;
};

export const createQuestion = async (questionData) => {
    const { data } = await axiosInstance.post('/qa/question', questionData);
    return data;
};

export const getPendingQuestions = async () => {
    const { data } = await axiosInstance.get('/qa/admin/pending');
    return data;
};

export const answerQuestion = async (id, answerData) => {
    const { data } = await axiosInstance.post(`/qa/answer/${id}`, answerData);
    return data;
};

export const deleteQuestion = async (id) => {
    const { data } = await axiosInstance.delete(`/qa/question/${id}`);
    return data;
};

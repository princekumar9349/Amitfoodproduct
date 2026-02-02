import api from './api';

const paymentService = {
    verifyPayment: async (paymentData) => {
        // paymentData: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
        const response = await api.post('/api/payment/verify', paymentData);
        return response.data;
    },
};

export default paymentService;

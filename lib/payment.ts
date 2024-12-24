import axios from "axios";


const PAYSTACK_SECRET_KEY = "sk_test_fcc05416469bb4e211d4f89d6870b5328dc847dc";

export const initializePayment = async (paymentData:any) => {
  const response = await axios.post(
    'https://api.paystack.co/transaction/initialize',
    paymentData,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  return response.data;
};
export const verifyPayment = async (reference:any) => {

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );
  
    return response.data;
  };
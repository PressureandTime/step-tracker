import client from './client';

export const registerUser = async ({ email, password, recaptchaToken }) => {
  const response = await client.post('/registration', {
    email,
    password,
    recaptchaToken,
  });
  return response.data;
};

export const confirmAccountActivation = async (id) => {
  const response = await client.post('/activate_account', { id });
  return response.data;
};

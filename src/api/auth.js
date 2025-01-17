import client from './client';

export const registerUser = async ({ email, password, recaptchaToken, privacyPolicyAccepted }) => {
  const response = await client.post('/registration', {
    email,
    password,
    recaptchaToken,
    privacyPolicyAccepted,
  });
  return response.data;
};

export const confirmAccountActivation = async (id) => {
  const response = await client.post('/activate_account', { id });
  return response.data;
};

export const testApiRequest = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

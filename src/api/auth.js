import client from './client';

export const registerUser = async ({
  firstName,
  lastName,
  email,
  password,
  recaptchaToken,
  privacyPolicyAccepted,
}) => {
  console.log('Sending registration request...');
  console.log(
    'first_name, last_name, email, password, g-recaptcha-response, privacy-policy-check',
    firstName,
    lastName,
    email,
    password,
    recaptchaToken,
    privacyPolicyAccepted
  );
  try {
    const response = await client.post('/users/registration', {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      'g-recaptcha-response': recaptchaToken,
      'privacy-policy-check': privacyPolicyAccepted,
    });
    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    console.error('Error response:', error.response);
    console.error('Error message:', error.message);
    throw error;
  }
};

export const confirmAccountActivation = async (id) => {
  console.log('Sending account activation request...');
  try {
    const response = await client.post('/activate_account', { id });
    console.log('Account activation successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Account activation failed:', error);
    console.error('Error response:', error.response);
    console.error('Error message:', error.message);
    throw error;
  }
};

export const testApiRequest = async () => {
  console.log('Sending test API request...');
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log('Test API request successful:', response.json());
    return response.json();
  } catch (error) {
    console.error('Test API request failed:', error);
    throw error;
  }
};

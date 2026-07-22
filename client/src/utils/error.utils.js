const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

export const normalizeApiError = (error) => {
  if (!error.response) {
    return {
      message:
        'Unable to connect to the server. Please check your internet connection.',
      statusCode: 0,
      errors: null,
      isNetworkError: true,
    };
  }

  const responseData = error.response.data || {};

  return {
    message: responseData.message || error.message || DEFAULT_ERROR_MESSAGE,
    statusCode: responseData.statusCode || error.response.status,
    errors: responseData.errors || null,
    isNetworkError: false,
  };
};

export const getErrorMessage = (error) => {
  if (!error) {
    return DEFAULT_ERROR_MESSAGE;
  }

  if (typeof error === 'string') {
    return error;
  }

  return error.message || DEFAULT_ERROR_MESSAGE;
};

import axios from 'axios';

export const handleUncaughtError = (setErrorMessages, error) => {
    // Log the error for debugging purposes
    console.error('Uncaught runtime error:', error);
  
    // Set error message and clear after 2.5 seconds
    setErrorMessages([{ type: 'danger', message: 'An unexpected error occurred' }]);
    setTimeout(() => {
      setErrorMessages([]);
    }, 2500);
  };

export const handleApiError = (setErrorMessages, error) => {
  let errorMessage;

  // Customize error handling based on the error type or status code
  if (axios.isCancel(error)) {
    errorMessage = 'Request canceled';
  } else if (error.response) {
    // The request was made and the server responded with a status code
    const { status, data } = error.response;
    errorMessage = `Server error: ${status} - ${data.message}`;
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'No response from the server';
  } else {
    // Something happened in setting up the request that triggered an Error
    //errorMessage = 'Error in request setup';
    errorMessage = error;
  }

  // Set error message and clear after 2.5 seconds
  setErrorMessages([{ type: 'warning', message: errorMessage }]);
  setTimeout(() => {
    setErrorMessages([]);
  }, 2500);
};
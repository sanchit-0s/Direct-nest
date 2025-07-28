// API configuration for VS Code development
export const API_BASE_URL = 'http://localhost:3001/api';

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  return response;
};

// Auth API calls
export const loginUser = async (email, password) => {
  try {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await apiCall('/auth/logout', {
      method: 'POST',
    });
    return await response.json();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const registerUser = async (username, email, password) => {
  const response = await apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
  return response.json();
};

export const createPost = async (postData) => {
  const response = await apiCall('/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
  });
  return response.json();
};

export const getUserPosts = async () => {
  try {
    const response = await apiCall('/posts/user', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API getUserPosts response:", data);
    return data;
  } catch (error) {
    console.error('getUserPosts API error:', error);
    throw error;
  }
};

export const getAllPosts = async () => {
  const response = await apiCall('/posts', {
    method: 'GET',
  });
  return response.json();
};

export const getPostById = async (id) => {
  const response = await apiCall(`/posts/${id}`, {
    method: 'GET',
  });
  return response.json();
};

// Chat API functions
export const createOrGetChat = async (receiverId) => {
  try {
    const response = await apiCall('/chats/create', {
      method: 'POST',
      body: JSON.stringify({ receiverId }),
    });
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

  export const getUserChats = async () => {
    try {
      const response = await apiCall('/chats', {
        method: 'GET',
      });
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  export const sendMessage = async (chatId, content) => {
    try {
      const response = await apiCall('/chats/message', {
        method: 'POST',
        body: JSON.stringify({ chatId, content }),
      });
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  export const getChatMessages = async (chatId) => {
    try {
      const response = await apiCall(`/chats/${chatId}/messages`, {
        method: 'GET',
      });
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

// Payment API functions
export const createPayment = async (postId, amount) => {
  try {
    const response = await apiCall('/payments', {
      method: 'POST',
      body: JSON.stringify({ postId, amount })
    });
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getUserPayments = async () => {
  try {
    const response = await apiCall('/payments/user', {
      method: 'GET',
    });
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getPaymentDetails = async (paymentId) => {
  try {
    const response = await apiCall(`/payments/${paymentId}`, {
      method: 'GET',
    });
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const updatePaymentStatus = async (paymentId, status, stripePaymentIntentId = null) => {
  try {
    const response = await apiCall(`/payments/${paymentId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, stripePaymentIntentId })
    });
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const updateBankDetails = async (bankDetails) => {
  try {
    const response = await apiCall('/payments/bank-details', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bankDetails)
    });
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// User API functions
export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const toggleSavePost = async (postId) => {
  try {
    const response = await apiCall(`/users/save/${postId}`, {
      method: 'POST',
    });
  // If no content or content type not JSON, don't parse JSON
    const contentType = response.headers.get('content-type');
    if (response.status === 204) {
      // No content, just return success or something
      return { success: true };
  } else if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // fallback - maybe parse text or return raw response
      const text = await response.text();
      return { data: text };
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};  

export const getSavedPosts = async () => {
  try {
    const response = await apiCall('/users/saved', {
      method: 'GET',
    });
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
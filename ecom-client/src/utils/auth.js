// Function to store user information
export const login = (username, userType) => {
    localStorage.setItem('username', username);
    localStorage.setItem('userType', userType);
};

// Function to get the user type
export const getUserType = () => {
    return localStorage.getItem('userType') || 'guest'; // Returns 'guest' if userType is not set
};

// Other functions (logout, etc.) can remain the same
import { handleResponse } from '../utils/errorUtil.js';

class AuthService {
    constructor() {
        this.TOKEN_KEY = 'auth_token';
        this.USER_KEY = 'user_data';
    }

    async login(email, password) {
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: authService.getAuthHeaders(),
            body: JSON.stringify({ email, password }),
        });

        const data = await handleResponse(response);

        this.setToken(data.token);
        this.setUserData({
            email: data.userEmail,
            role: data.userRole,
            tokenType: data.tokenType,
            expiresIn: data.expiresIn
        });

        return data;
    }

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    setToken(token) {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    getUserData() {
        const userData = localStorage.getItem(this.USER_KEY);
        return userData ? JSON.parse(userData) : null;
    }

    setUserData(userData) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
    }

    isAuthenticated() {
        const token = this.getToken();
        const userData = this.getUserData();

        if (!token || !userData) {
            return false;
        }

        if (userData.expiresIn) {
            const now = Date.now();
            const tokenAge = now - (userData.loginTime || now);
            if (tokenAge > userData.expiresIn * 1000) {
                this.logout();
                return false;
            }
        }

        return true;
    }

    getAuthHeaders() {
        const token = this.getToken();
        if (token) {
            return {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
        }
        return {
            'Content-Type': 'application/json',
        };
    }
}

export const authService = new AuthService();
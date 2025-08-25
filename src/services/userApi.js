import {handleResponse} from "../utils/errorUtil.js";

export const userApi = {
    async getUsers(page = 0, size = 10, firstName = '', lastName = '', email = '') {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            ...(firstName && {firstName}),
            ...(lastName && {lastName}),
            ...(email && {email}),
        });

        const response = await fetch(`/api/v1/users?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return handleResponse(response);
    },

    async createUser(data) {
        const response = await fetch('/api/v1/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return handleResponse(response);
    },

    async deleteUser(id) {
        const response = await fetch(`/api/v1/users/${id}`, {
            method: 'DELETE'
        });

        return handleResponse(response);
    },

    async getUserById(id) {
        const response = await fetch(`/api/v1/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return handleResponse(response);
    },

    async updateUser(id, data) {
        const response = await fetch(`/api/v1/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return handleResponse(response);
    }
};
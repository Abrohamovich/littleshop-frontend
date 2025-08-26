import {handleResponse} from '../utils/errorUtil.js';
import { authService } from './authService.js';

export const categoryApi = {
    async getCategories(page = 0, size = 10, name = '', description = '') {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            ...(name && {name}),
            ...(description && {description})
        });

        const response = await fetch(`/api/v1/categories?${params}`, {
            method: 'GET',
            headers: authService.getAuthHeaders()
        });

        return handleResponse(response);
    },

    async createCategory(data) {
        const response = await fetch('/api/v1/categories', {
            method: 'POST',
            headers: authService.getAuthHeaders(),
            body: JSON.stringify(data)
        });

        return handleResponse(response);
    },

    async deleteCategory(id) {
        const response = await fetch(`/api/v1/categories/${id}`, {
            method: 'DELETE'
        });

        return handleResponse(response);
    },

    async getCategoryById(id) {
        const response = await fetch(`/api/v1/categories/${id}`, {
            method: 'GET',
            headers: authService.getAuthHeaders(),
        });

        return handleResponse(response);
    },

    async updateCategory(id, data) {
        const response = await fetch(`/api/v1/categories/${id}`, {
            method: 'PUT',
            headers: authService.getAuthHeaders(),
            body: JSON.stringify(data)
        });

        return handleResponse(response);
    }
};
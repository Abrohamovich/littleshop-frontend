import {handleResponse} from "../utils/errorUtil.js";
import { authService } from './authService.js';

export const customerApi = {
    async getCustomers(page = 0, size = 10, firstName = '', lastName = '', email = '') {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            ...(firstName && {firstName}),
            ...(lastName && {lastName}),
            ...(email && {email}),
        });

        const response = await fetch(`/api/v1/customers?${params}`, {
            method: 'GET',
            headers: authService.getAuthHeaders(),
        });

        return handleResponse(response);
    },

    async createCustomer(data) {
        const response = await fetch('/api/v1/customers', {
            method: 'POST',
            headers: authService.getAuthHeaders(),
            body: JSON.stringify(data)
        });

        return handleResponse(response);
    },

    async deleteCustomer(id) {
        const response = await fetch(`/api/v1/customers/${id}`, {
            method: 'DELETE',
            headers: authService.getAuthHeaders()
        });

        return handleResponse(response);
    },

    async getCustomerById(id) {
        const response = await fetch(`/api/v1/customers/${id}`, {
            method: 'GET',
            headers: authService.getAuthHeaders(),
        });

        return handleResponse(response);
    },

    async updateCustomer(id, data) {
        const response = await fetch(`/api/v1/customers/${id}`, {
            method: 'PUT',
            headers: authService.getAuthHeaders(),
            body: JSON.stringify(data)
        });

        return handleResponse(response);
    }
};
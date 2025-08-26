import {handleResponse} from "../utils/errorUtil.js";
import { authService } from './authService.js';

export const orderApi = {
    async getOrders(page = 0, size = 10, customerId = null, userId = null) {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            ...(customerId && {customerId}),
            ...(userId && {userId})
        });

        const response = await fetch(`/api/v1/orders?${params}`, {
            method: 'GET',
            headers: authService.getAuthHeaders(),
        });

        return handleResponse(response);
    },

    async createOrder(data) {
        const response = await fetch('/api/v1/orders', {
            method: 'POST',
            headers: authService.getAuthHeaders(),
            body: JSON.stringify(data)
        });

        return handleResponse(response);
    },

    async deleteOrder(id) {
        const response = await fetch(`/api/v1/orders/${id}`, {
            method: 'DELETE',
            headers: authService.getAuthHeaders()
        });

        return handleResponse(response);
    },

    async getOrderById(id) {
        const response = await fetch(`/api/v1/orders/${id}`, {
            method: 'GET',
            headers: authService.getAuthHeaders(),
        });

        return handleResponse(response);
    },

    async changeCustomer(id, data) {
        const response = await fetch(`/api/v1/orders/change-customer/${id}`, {
            method: 'PUT',
            headers: authService.getAuthHeaders(),
            body: JSON.stringify(data)
        });

        return handleResponse(response);
    },

    async addOrderItem(id, data) {
        const response = await fetch(`/api/v1/orders/add-item/${id}`, {
            method: 'PUT',
            headers: authService.getAuthHeaders(),
            body: JSON.stringify(data)
        });

        return handleResponse(response);
    },

    async changeStatus(id, data) {
        const response = await fetch(`/api/v1/orders/change-status/${id}`, {
            method: 'PUT',
            headers: authService.getAuthHeaders(),
            body: JSON.stringify(data)
        });

        return handleResponse(response);
    },

    async removeOrderItem(id, data) {
        const response = await fetch(`/api/v1/orders/remove-item/${id}`, {
            method: 'PUT',
            headers: authService.getAuthHeaders(),
            body: JSON.stringify(data)
        });

        return handleResponse(response);
    },

    async updateOrderItemQuantity(id, data) {
        const response = await fetch(`/api/v1/orders/update-item-quantity/${id}`, {
            method: 'PUT',
            headers: authService.getAuthHeaders(),
            body: JSON.stringify(data)
        });

        return handleResponse(response);
    }
};
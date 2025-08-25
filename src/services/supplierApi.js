import {handleResponse} from "../utils/errorUtil.js";

export const supplierApi = {
    async getSuppliers(page = 0, size = 10, name = '', email = '', phone = '') {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            ...(name && {name}),
            ...(email && {email}),
            ...(phone && {phone}),
        });

        const response = await fetch(`/api/v1/suppliers?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return handleResponse(response);
    },

    async createSupplier(data) {
        const response = await fetch('/api/v1/suppliers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return handleResponse(response);
    },

    async deleteSupplier(id) {
        const response = await fetch(`/api/v1/suppliers/${id}`, {
            method: 'DELETE'
        });

        return handleResponse(response);
    },

    async getSupplierById(id) {
        const response = await fetch(`/api/v1/suppliers/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return handleResponse(response);
    },

    async updateSupplier(id, data) {
        const response = await fetch(`/api/v1/suppliers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return handleResponse(response);
    }
};
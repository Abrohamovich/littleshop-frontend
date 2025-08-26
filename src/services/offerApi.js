import {handleResponse} from "../utils/errorUtil.js";
import { authService } from './authService.js';

export const offerApi = {
    async getOffers(page = 0, size = 10, name = '', categoryId = 0, supplierId = 0, priceGreaterEqual = 0, priceLessEqual = 0) {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            ...(name && {name}),
            ...(categoryId && {categoryId}),
            ...(supplierId && {supplierId}),
            ...(priceGreaterEqual && {priceGreaterEqual}),
            ...(priceLessEqual && {priceLessEqual})
        });

        const response = await fetch(`/api/v1/offers?${params}`, {
            method: 'GET',
            headers: authService.getAuthHeaders(),
        });

        return handleResponse(response);
    },

    async createOffer(data) {
        const response = await fetch('/api/v1/offers', {
            method: 'POST',
            headers: authService.getAuthHeaders(),
            body: JSON.stringify(data)
        });

        return handleResponse(response);
    },

    async deleteOffer(id) {
        const response = await fetch(`/api/v1/offers/${id}`, {
            method: 'DELETE',
            headers: authService.getAuthHeaders()
        });

        return handleResponse(response);
    },

    async getOfferById(id) {
        const response = await fetch(`/api/v1/offers/${id}`, {
            method: 'GET',
            headers: authService.getAuthHeaders(),
        });

        return handleResponse(response);
    },

    async updateOffer(id, data) {
        const response = await fetch(`/api/v1/offers/${id}`, {
            method: 'PUT',
            headers: authService.getAuthHeaders(),
            body: JSON.stringify(data)
        });

        return handleResponse(response);
    }
};
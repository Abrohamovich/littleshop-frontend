export const offerApi = {
    async getOffers(page = 0, size = 10, name = '', categoryId = 0, supplierId = 0, priceGreaterEqual = 0, priceLessEqual = 0) {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            ...(name && { name }),
            ...(categoryId && { categoryId }),
            ...(supplierId && { supplierId }),
            ...(priceGreaterEqual && { priceGreaterEqual }),
            ...(priceLessEqual && { priceLessEqual })
        });

        const response = await fetch(`/api/v1/offers?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    async createOffer(data) {
        const response = await fetch('/api/v1/offers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    async deleteOffer(id) {
        const response = await fetch(`/api/v1/offers/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    },

    async getOfferById(id) {
        const response = await fetch(`/api/v1/offers/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    async updateOffer(id, data) {
        const response = await fetch(`/api/v1/offers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }
};
export const customerApi = {
    async getCustomers(page = 0, size = 10, firstName = '', lastName = '', email = '') {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(email && { email }),
        });

        const response = await fetch(`/api/v1/customers?${params}`, {
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

    async createCustomer(data) {
        const response = await fetch('/api/v1/customers', {
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

    async deleteCustomer(id) {
        const response = await fetch(`/api/v1/customers/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    },

    async getCustomerById(id) {
        const response = await fetch(`/api/v1/customers/${id}`, {
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

    async updateCustomer(id, data) {
        const response = await fetch(`/api/v1/customers/${id}`, {
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
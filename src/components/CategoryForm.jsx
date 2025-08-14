import React, { useState } from 'react';
import axios from 'axios';

const CategoryForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await axios.post(
                '/api/v1/categories',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Category created:', response.data);
            setMessage('Category successfully created!');
            setFormData({
                name: '',
                description: ''
            });
        } catch (error) {
            console.error('Error creating category:', error);
            setMessage('Error creating category.');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
            <h2>Create New Category</h2>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
            />
            <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                required
            />
            <button type="submit">Create Category</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default CategoryForm;
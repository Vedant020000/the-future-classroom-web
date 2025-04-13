'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FormField } from '@/lib/aiToolsData'; // Assuming this path is correct
import styles from './AiToolForm.module.css';

interface AiToolFormProps {
    formFields: FormField[];
    onSubmit: (formData: Record<string, any>) => Promise<void>;
    isLoading: boolean;
    submitButtonText?: string;
}

const AiToolForm: React.FC<AiToolFormProps> = ({ formFields, onSubmit, isLoading, submitButtonText = 'Generate' }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});

    // Initialize form state when fields change
    useEffect(() => {
        const initialData: Record<string, any> = {};
        formFields.forEach(field => {
            initialData[field.id] = field.type === 'checkbox' ? false : ''; // Default empty or false for checkbox
        });
        setFormData(initialData);
    }, [formFields]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // Handle checkbox separately
        const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prevData => ({
            ...prevData,
            [name]: newValue,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.toolForm}>
            {formFields.map((field) => (
                <div key={field.id} className={styles.formGroup}>
                    <label htmlFor={field.id} className={styles.label}>
                        {field.label}
                        {field.required && <span className={styles.required}>*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                        <textarea
                            id={field.id}
                            name={field.id}
                            value={formData[field.id] || ''}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            required={field.required}
                            className={styles.textarea}
                            rows={5} // Default rows, can be adjusted
                            disabled={isLoading}
                        />
                    ) : field.type === 'select' ? (
                        <select
                            id={field.id}
                            name={field.id}
                            value={formData[field.id] || ''}
                            onChange={handleChange}
                            required={field.required}
                            className={styles.select}
                            disabled={isLoading}
                        >
                            <option value="" disabled>{field.placeholder || 'Select an option'}</option>
                            {field.options?.map((option, index) => (
                                typeof option === 'string' ? (
                                    <option key={index} value={option}>{option}</option>
                                ) : (
                                    <option key={index} value={option.value}>{option.label}</option>
                                )
                            ))}
                        </select>
                    ) : field.type === 'checkbox' ? (
                        <div className={styles.checkboxWrapper}>
                            <input
                                type="checkbox"
                                id={field.id}
                                name={field.id}
                                checked={formData[field.id] || false}
                                onChange={handleChange}
                                className={styles.checkbox}
                                disabled={isLoading}
                            />
                        </div>
                    ) : (
                        <input
                            type={field.type === 'number' ? 'number' : 'text'} // Handle number type
                            id={field.id}
                            name={field.id}
                            value={formData[field.id] || ''}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            required={field.required}
                            className={styles.input}
                            disabled={isLoading}
                        />
                    )}
                    {field.helperText && <p className={styles.helperText}>{field.helperText}</p>}
                </div>
            ))}
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? 'Generating...' : submitButtonText}
            </button>
        </form>
    );
};

export default AiToolForm; 
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import './globals.css';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'teacher',
        schoolName: '',
        agreeTerms: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.schoolName.trim()) {
            newErrors.schoolName = 'School name is required';
        }

        if (!formData.agreeTerms) {
            newErrors.agreeTerms = 'You must agree to the terms and privacy policy';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // In a real app, this would be a fetch call to your registration API
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate successful registration and redirect
            router.push('/login?registered=true');
        } catch (err) {
            setErrors({
                form: 'Registration failed. Please try again later.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold mb-2">
                            <span className="gradient-text">Create Your Account</span>
                        </h1>
                        <p className="text-foreground/70">
                            Join thousands of educators using AI to transform their classrooms
                        </p>
                    </div>

                    <div className="bg-card border border-border/40 rounded-xl shadow-lg p-8">
                        {errors.form && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                                {errors.form}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                                        First Name
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg bg-card border ${errors.firstName ? 'border-red-500' : 'border-border/40'} focus:outline-none focus:ring-2 focus:ring-primary/30`}
                                        placeholder="John"
                                    />
                                    {errors.firstName && (
                                        <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg bg-card border ${errors.lastName ? 'border-red-500' : 'border-border/40'} focus:outline-none focus:ring-2 focus:ring-primary/30`}
                                        placeholder="Doe"
                                    />
                                    {errors.lastName && (
                                        <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg bg-card border ${errors.email ? 'border-red-500' : 'border-border/40'} focus:outline-none focus:ring-2 focus:ring-primary/30`}
                                    placeholder="you@school.edu"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg bg-card border ${errors.password ? 'border-red-500' : 'border-border/40'} focus:outline-none focus:ring-2 focus:ring-primary/30`}
                                        placeholder="••••••••"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg bg-card border ${errors.confirmPassword ? 'border-red-500' : 'border-border/40'} focus:outline-none focus:ring-2 focus:ring-primary/30`}
                                        placeholder="••••••••"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-sm font-medium mb-2">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-card border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                >
                                    <option value="teacher">Teacher</option>
                                    <option value="administrator">School Administrator</option>
                                    <option value="specialist">Educational Specialist</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="schoolName" className="block text-sm font-medium mb-2">
                                    School or Institution
                                </label>
                                <input
                                    id="schoolName"
                                    name="schoolName"
                                    type="text"
                                    value={formData.schoolName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg bg-card border ${errors.schoolName ? 'border-red-500' : 'border-border/40'} focus:outline-none focus:ring-2 focus:ring-primary/30`}
                                    placeholder="Westview High School"
                                />
                                {errors.schoolName && (
                                    <p className="mt-1 text-sm text-red-500">{errors.schoolName}</p>
                                )}
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="agreeTerms"
                                        name="agreeTerms"
                                        type="checkbox"
                                        checked={formData.agreeTerms}
                                        onChange={handleChange}
                                        className={`w-4 h-4 text-primary focus:ring-primary/30 border-border/40 rounded ${errors.agreeTerms ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="agreeTerms" className={`font-medium ${errors.agreeTerms ? 'text-red-500' : ''}`}>
                                        I agree to the
                                        <Link href="/terms" className="text-primary hover:text-primary-dark ml-1">
                                            Terms of Service
                                        </Link>
                                        {' '}and{' '}
                                        <Link href="/privacy" className="text-primary hover:text-primary-dark">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                    {errors.agreeTerms && (
                                        <p className="mt-1 text-sm text-red-500">{errors.agreeTerms}</p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary flex justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating your account...
                                    </>
                                ) : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-border/40 text-center">
                            <p className="text-sm text-foreground/70">
                                Already have an account?{' '}
                                <Link
                                    href="/login"
                                    className="text-primary hover:text-primary-dark transition-colors font-medium"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
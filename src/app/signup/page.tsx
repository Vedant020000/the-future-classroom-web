'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import pb from '@/lib/pocketbase'; // Import PocketBase instance
import { useAuth } from '@/lib/AuthContext'; // Import AuthContext
// import './globals.css';

export default function SignupPage() {
    const router = useRouter();
    const { refresh } = useAuth(); // Get refresh function from context
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'teacher',
        schoolName: '',
        agreeTerms: false,
        name: '' // Add name field for PocketBase default collection
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
            // Automatically update the 'name' field for PocketBase
            ...(name === 'firstName' && { name: `${value} ${prev.lastName}` }),
            ...(name === 'lastName' && { name: `${prev.firstName} ${value}` }),
        }));

        // Clear error when field is edited
        if (errors[name] || errors.form) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                delete newErrors.form; // Clear form error on any change
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
            // Prepare data for PocketBase
            const dataToSubmit = {
                email: formData.email,
                password: formData.password,
                passwordConfirm: formData.confirmPassword,
                name: formData.name.trim(), // Required by default PocketBase users collection
                // Add any other custom fields you have in your PocketBase 'users' collection
                firstName: formData.firstName,
                lastName: formData.lastName,
                role: formData.role,
                schoolName: formData.schoolName,
                // You might store 'agreeTerms' differently or just use it for validation
            };

            console.log("Submitting data to PocketBase:", dataToSubmit);

            // Call PocketBase create user
            const newUser = await pb.collection('users').create(dataToSubmit);

            console.log("Signup successful:", newUser);

            // Optional: Attempt to log the user in immediately after signup
            // This might require email verification depending on your PocketBase settings
            try {
                await pb.collection('users').authWithPassword(formData.email, formData.password);
                await refresh(); // Refresh auth state
                console.log("Auto-login after signup successful.");
                router.push('/dashboard'); // Redirect to dashboard after successful login
            } catch (authError) {
                console.warn("Auto-login after signup failed (maybe verification needed?):", authError);
                // Redirect to login page with a success message, prompting verification if needed
                router.push('/login?registered=true');
            }

        } catch (err: any) {
            console.error("PocketBase signup error:", err);
            let errorMessage = 'Registration failed. Please try again later.';
            if (err?.data?.data?.email?.message) {
                // Example: Extract specific PocketBase validation error
                errorMessage = `Registration failed: ${err.data.data.email.message}`;
            } else if (err.message) {
                errorMessage = `Registration failed: ${err.message}`;
            }
            setErrors({ form: errorMessage });
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
                                        disabled={isLoading}
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
                                        disabled={isLoading}
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
                                    disabled={isLoading}
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
                                        disabled={isLoading}
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
                                        disabled={isLoading}
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
                                    disabled={isLoading}
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
                                    disabled={isLoading}
                                />
                                {errors.schoolName && (
                                    <p className="mt-1 text-sm text-red-500">{errors.schoolName}</p>
                                )}
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="agreeTerms"
                                    name="agreeTerms"
                                    type="checkbox"
                                    checked={formData.agreeTerms}
                                    onChange={handleChange}
                                    className={`h-4 w-4 rounded border-border/60 text-primary focus:ring-primary/50 ${errors.agreeTerms ? 'border-red-500' : ''}`}
                                    disabled={isLoading}
                                />
                                <label htmlFor="agreeTerms" className="ml-2 block text-sm text-foreground/80">
                                    I agree to the
                                    <Link href="/terms" className="ml-1 font-medium text-primary hover:underline">Terms and Conditions</Link>
                                    and
                                    <Link href="/privacy" className="ml-1 font-medium text-primary hover:underline">Privacy Policy</Link>.
                                </label>
                            </div>
                            {errors.agreeTerms && (
                                <p className="mt-1 text-sm text-red-500">{errors.agreeTerms}</p>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full btn btnPrimary py-3 px-4 text-base transition duration-300 ease-in-out hover:scale-[1.02] disabled:opacity-60 disabled:pointer-events-none"
                                >
                                    {isLoading ? (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : null}
                                    {isLoading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center text-sm text-foreground/70">
                            Already have an account?
                            <Link href="/login" className="ml-1 font-medium text-primary hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
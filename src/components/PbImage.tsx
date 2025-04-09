'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import pb from '@/lib/pocketbase';

interface PbImageProps {
    record: any;
    filename: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean;
}

export default function PbImage({
    record,
    filename,
    alt,
    width,
    height,
    className = '',
    priority = false
}: PbImageProps) {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [error, setError] = useState(false);

    useEffect(() => {
        if (record && filename) {
            try {
                const url = pb.files.getUrl(record, filename);
                setImageUrl(url);
                setError(false);
            } catch (err) {
                console.error('Error loading image:', err);
                setError(true);
            }
        }
    }, [record, filename]);

    // Show nothing while loading
    if (!imageUrl && !error) {
        return (
            <div
                className={`bg-gray-200 animate-pulse ${className}`}
                style={{ width: `${width}px`, height: `${height}px` }}
            />
        );
    }

    // Show placeholder on error
    if (error) {
        return (
            <div
                className={`bg-gray-200 flex items-center justify-center text-gray-500 ${className}`}
                style={{ width: `${width}px`, height: `${height}px` }}
            >
                <span>Image not available</span>
            </div>
        );
    }

    // Show actual image
    return (
        <Image
            src={imageUrl}
            alt={alt}
            width={width}
            height={height}
            className={className}
            priority={priority}
            unoptimized={true} // Use this to bypass image optimization for external images
        />
    );
} 
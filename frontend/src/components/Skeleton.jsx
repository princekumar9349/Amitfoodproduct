import React from 'react';
import clsx from 'clsx';

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={clsx("animate-pulse bg-gray-200 rounded-md", className)}
            {...props}
        />
    );
};

export const ProductCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4">
        <Skeleton className="h-48 w-full mb-4 rounded-lg" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-10 rounded-full" />
        </div>
    </div>
);

export default Skeleton;

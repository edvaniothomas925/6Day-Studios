import React, { useState } from 'react';
import { Skeleton } from './Skeleton';
import { cn } from '../lib/utils';

interface OptimizedImageProps {
  src?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  loading?: "lazy" | "eager";
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

export const OptimizedImage = ({ src, alt, className, containerClassName, referrerPolicy = "no-referrer", ...props }: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {!isLoaded && <Skeleton className="absolute inset-0 z-10 w-full h-full" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        referrerPolicy={referrerPolicy}
        className={cn(
          "transition-opacity duration-700",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      />
    </div>
  );
};

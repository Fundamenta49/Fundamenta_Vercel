import { cn } from "@/lib/utils";

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function Loading({ className, size = "md", ...props }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-3",
    lg: "w-8 h-8 border-4"
  };

  return (
    <div
      className={cn(
        "loading-spinner inline-block",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

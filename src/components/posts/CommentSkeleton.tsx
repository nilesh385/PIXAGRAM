// components/feed/CommentSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function CommentSkeleton() {
  return (
    <div className="flex items-start gap-2">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="w-20 h-3 rounded" />
        <Skeleton className="w-40 h-3 rounded" />
      </div>
    </div>
  );
}

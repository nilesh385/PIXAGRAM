// components/feed/PostSkeleton.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostSkeleton() {
  return (
    <Card className="w-full max-w-xl mx-auto shadow-md rounded-2xl overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="w-24 h-4 rounded" />
          <Skeleton className="w-16 h-3 rounded" />
        </div>
      </CardHeader>

      {/* Image */}
      <Skeleton className="w-full h-[300px]" />

      {/* Content */}
      <CardContent className="p-4 space-y-3">
        <Skeleton className="w-32 h-4 rounded" />
        <Skeleton className="w-60 h-3 rounded" />
        <div className="flex items-center gap-4">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-12 h-3 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

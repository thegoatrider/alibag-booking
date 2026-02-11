export default function SkeletonCard() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="aspect-square rounded-xl bg-gray-200" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
  );
}

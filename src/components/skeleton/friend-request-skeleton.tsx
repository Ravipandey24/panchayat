import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const FriendRequestSkeleton = ({}) => {
  return (
    <div className="p-4 grid gap-4">
      {Array(5)
        .fill(0)
        .map((_, idx) => (
          <Card key={idx}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full"></Skeleton>
                  <div className="space-y-1">
                    <Skeleton className="w-24 h-5"></Skeleton>
                    <Skeleton className="w-24 h-5"></Skeleton>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Skeleton className="w-10 h-10 rounded-full"></Skeleton>
                  <Skeleton className="w-10 h-10 rounded-full"></Skeleton>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default FriendRequestSkeleton;

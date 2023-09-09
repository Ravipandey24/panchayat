import FriendRequestSkeleton from "@/components/skeleton/friend-request-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const loading = ({}) => {
  return (
    <FriendRequestSkeleton></FriendRequestSkeleton>
  );
};

export default loading;

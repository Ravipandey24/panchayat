import { Skeleton } from "../ui/skeleton";
import { List, ListItem } from "../ui/list";

const DashboardSkeleton = ({}) => {
  return (
    <div className="w-full p-2 space-y-2">
      <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
        <Skeleton className="h-8 rounded-md"></Skeleton>
        <Skeleton className="h-8 rounded-md"></Skeleton>
      </div>
      <List>
        {Array(5)
          .fill(0)
          .map((_, idx) => (
            <ListItem
              key={"dashboard_skeleton" + idx}
              className="group justify-between border-t-[1px] border-gray-800"
            >
              <Skeleton className="w-full h-16"></Skeleton>
            </ListItem>
          ))}
      </List>
    </div>
  );
};

export default DashboardSkeleton;

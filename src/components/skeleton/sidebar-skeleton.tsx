import { Skeleton } from "../ui/skeleton";

const SidebarSkeleton = ({}) => {
  const iconWrapperClasses = (idx: number) =>
    idx === 0
      ? "group relative h-12 w-12 bg-cover transition-all hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-[1px] rounded-[15px] cursor-pointer mx-auto mb-2 flex items-center justify-center bg-gray-500"
      : "group relative h-12 w-12 bg-cover transition-all hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-[1px] rounded-full hover:rounded-[15px] cursor-pointer mx-auto mb-2 flex items-center justify-center bg-gray-500";

  return (
    <div className="hidden-scrollbar z-40 h-screen w-[70px] gap-3 overflow-y-auto pt-2 bg-background/80 border-r">
      {Array(5)
        .fill(0)
        .map((_, idx) => (
          <a key={'sidebar_skeleton' + idx} className={iconWrapperClasses(idx)}>
            <Skeleton className="h-10 w-10 rounded-full"></Skeleton>
          </a>
        ))}
    </div>
  );
};

export default SidebarSkeleton;

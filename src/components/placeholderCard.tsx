import { FC } from "react";
import { Card, CardContent } from "./ui/card";

interface placeholderCardProps {
  text: string;
}

const PlaceholderCard: FC<placeholderCardProps> = ({ text }) => {
  return (
    <Card className="rounded-md">
      <CardContent className="p-3">
        <span className="text-gray-400">{text}</span>
      </CardContent>
    </Card>
  );
};

export default PlaceholderCard;

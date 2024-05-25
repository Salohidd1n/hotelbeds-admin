import { Badge } from "@chakra-ui/react";

const BadgeComponent = ({ children, ...props }) => {
  return (
    <Badge
      px="10px"
      py="2px"
      bg={props.color + "1d"}
      color={props.color}
      textTransform="none"
      fontWeight={500}
      borderRadius="lg"
      {...props}
    >
      {children}
    </Badge>
  );
};
export default BadgeComponent;

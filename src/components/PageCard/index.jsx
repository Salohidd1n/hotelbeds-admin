import { Card, CardFooter, CardHeader, Stack } from "@chakra-ui/react";

const PageCard = ({ children, ...props }) => {
  return (
    <Card overflow="auto" {...props}>
      {children}
    </Card>
  );
};

export const PageCardHeader = ({ children, ...props }) => {
  return (
    <CardHeader
      borderBottom="1px solid"
      borderColor="border"
      display="flex"
      alignItems="center"
      height="56px"
      minHeight="56px"
      p={0}
      {...props}
    >
      {children}
    </CardHeader>
  );
};

export const PageCardForm = ({ children, ...props }) => {
  return (
    <Stack overflow="auto" {...props}>
      {children}
    </Stack>
  );
};

export const PageCardFooter = ({ children, ...props }) => {
  return (
    <CardFooter
      borderTop="1px solid"
      borderColor="border"
      display="flex"
      alignItems="center"
      height="56px"
      minHeight="56px"
      {...props}
    >
      {children}
    </CardFooter>
  );
};

export default PageCard;

import { Input } from "@chakra-ui/react";

const InputFilter = ({ placeholder }) => {
  return (
    <Input
      placeholder={placeholder}
      borderRadius="0"
      // _hover={{ borderColor: "transparent" }}
      borderColor="transparent"
    />
  );
};
export default InputFilter;

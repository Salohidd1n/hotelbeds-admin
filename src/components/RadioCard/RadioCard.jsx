import { Box, useRadio } from "@chakra-ui/react";

const RadioCard = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "#007aff",
          color: "white",
          borderColor: "teal.600",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
};

export default RadioCard;

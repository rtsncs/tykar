import { Box, Grid } from "@chakra-ui/react";
import { useMemo } from "react";

function Dot() {
  return <Box bg="black" borderRadius="full" w="100%" h="100%" />;
}

// prettier-ignore
const dotLayouts  = [
    [
        false, false, false,
        false, true, false,
        false, false, false,
    ],
    [
        false, false, true,
        false, false, false,
        true, false, false,
    ],
    [
        false, false, true,
        false, true, false,
        true, false, false,
    ],
    [
        true, false, true,
        false, false, false,
        true, false, true,
    ],
    [
        true, false, true,
        false, true, false,
        true, false, true,
    ],
     [
        true, false, true,
        true, false, true,
        true, false, true,
    ],
];

export default function Die({
  number,
  rotate,
  selected,
  onClick,
}: {
  number: number;
  rotate?: boolean;
  selected?: boolean;
  onClick?: () => void;
}) {
  const rotation = useMemo(
    () => (rotate ? Math.random() * 360.0 : 0),
    [rotate, number],
  );
  const face = dotLayouts[number - 1] ?? [];

  return (
    <Grid
      rotate={`${rotation}deg`}
      borderRadius="xl"
      p="2"
      gap="2"
      bg={selected ? "gray" : "white"}
      color="black"
      w="72px"
      h="72px"
      m="3"
      inline
      templateColumns="repeat(3, 1fr)"
      templateRows="repeat(3, 1fr)"
      onClick={onClick}
      cursor={onClick ? "button" : "default"}
      _hover={
        onClick ? { borderColor: "black", borderWidth: "1px" } : undefined
      }
    >
      {face.map((hasDot, index) =>
        hasDot ? <Dot key={index} /> : <div key={index} />,
      )}
    </Grid>
  );
}

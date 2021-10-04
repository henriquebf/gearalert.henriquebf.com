import { useState, useMemo } from 'react';

const useHover = () => {
  const [isHovered, setHovered] = useState(false);

  const eventHandlers = useMemo(
    () => ({
      onMouseOver() {
        setHovered(true);
      },
      onMouseOut() {
        setHovered(false);
      },
    }),
    []
  );

  return [isHovered, eventHandlers];
};

export default useHover;

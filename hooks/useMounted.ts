import React, { useEffect, useState } from "react";

export const useMounted = () => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
};

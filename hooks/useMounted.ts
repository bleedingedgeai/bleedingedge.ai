import React, { useEffect, useState } from "react";

export function useMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}

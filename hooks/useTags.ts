import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useTags = (): string[] => {
  const router = useRouter();
  const [tags, setTags] = useState(
    (router.query.tags as string)?.split(",") || []
  );

  useEffect(() => {
    const handleRouteChange = (url) => {
      const u = new URL(`${process.env.NEXT_PUBLIC_URL}${url}`);
      const params1 = new URLSearchParams(u.search);
      setTags(params1.get("tags")?.split(",") || []);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return tags;
};

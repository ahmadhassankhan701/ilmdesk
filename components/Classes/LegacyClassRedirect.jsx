"use client";

import { Suspense, useEffect } from "react";
import { Box, Skeleton } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { pageBackground, pageColumnSx } from "@/lib/pageColumn";
import { legacyClassHref } from "@/lib/classCatalog";

function RedirectInner({ kind }) {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");
  const chapterId = params.get("chapterId");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const href = await legacyClassHref(kind, { id, chapterId });
        if (active) router.replace(href || "/classes");
      } catch (error) {
        console.error(error);
        if (active) router.replace("/classes");
      }
    })();
    return () => {
      active = false;
    };
  }, [kind, id, chapterId, router]);

  return (
    <Box sx={{ bgcolor: pageBackground, pt: { xs: "96px", md: "112px" }, pb: 8 }}>
      <Box sx={pageColumnSx}>
        <Skeleton variant="rounded" height={240} sx={{ borderRadius: "32px", bgcolor: "rgba(10, 25, 47, 0.08)" }} />
      </Box>
    </Box>
  );
}

export default function LegacyClassRedirect({ kind }) {
  return (
    <Suspense fallback={null}>
      <RedirectInner kind={kind} />
    </Suspense>
  );
}

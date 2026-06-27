import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="min-h-screen grid place-items-center bg-paper px-6">
      <div className="text-center max-w-md">
        <p className="eyebrow mb-6">Error · 404</p>
        <h1 className="font-display text-7xl md:text-8xl text-ink leading-none">
          Off the<br /><em className="text-emerald-deep">map.</em>
        </h1>
        <p className="mt-6 text-muted-foreground">
          The page you're looking for has moved, or never existed in the first place.
        </p>
        <Link to="/" className="btn-primary mt-8">Return home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen grid place-items-center bg-paper px-6">
      <div className="text-center max-w-md">
        <p className="eyebrow mb-6">Something went wrong</p>
        <h1 className="font-display text-5xl md:text-6xl text-ink leading-tight">
          We hit a snag.
        </h1>
        <p className="mt-4 text-muted-foreground">
          You can try again, or head home.
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-primary">
            Try again
          </button>
          <a href="/" className="btn-ghost">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "2+FAPL — Onwards & Upwards" },
      {
        name: "description",
        content:
          "2 Plus Fortune Alliances Pvt Ltd — India's rural distribution aggregator. Bridging premium brands and rural consumers across kitchenware, electronics, appliances and more.",
      },
      { name: "author", content: "2 Plus Fortune Alliances Pvt Ltd" },
      { property: "og:title", content: "2+FAPL — Onwards & Upwards" },
      {
        property: "og:description",
        content:
          "Bridging premium brands and India's underserved rural consumers through a robust, trust-built distribution network.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // Global auto-reveal observer for any element using [data-reveal]
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)").forEach((el) => io.observe(el));
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

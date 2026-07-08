import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "../lib/auth-context";

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
      { title: "2+ Fortune Alliances — Onwards & Upwards" },
      {
        name: "description",
        content:
          "2 Plus Fortune Alliances Pvt Ltd — India's rural distribution aggregator. Bridging premium brands and rural consumers across kitchenware, electronics, appliances and more.",
      },
      { name: "author", content: "2 Plus Fortune Alliances Pvt Ltd" },
      { property: "og:title", content: "2+ Fortune Alliances — Onwards & Upwards" },
      {
        property: "og:description",
        content:
          "Bridging premium brands and India's underserved rural consumers through a robust, trust-built distribution network.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "2+ Fortune Alliances — Onwards & Upwards" },
      { name: "description", content: "Emerald Legacy Platform is a premium enterprise website and application platform built from scratch." },
      { property: "og:description", content: "Emerald Legacy Platform is a premium enterprise website and application platform built from scratch." },
      { name: "twitter:description", content: "Emerald Legacy Platform is a premium enterprise website and application platform built from scratch." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e2ee9ddd-092f-4b74-8557-8f71706d578e/id-preview-80bb17b6--3f5daaff-d970-47e5-8892-3900b90f2524.lovable.app-1782569931016.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e2ee9ddd-092f-4b74-8557-8f71706d578e/id-preview-80bb17b6--3f5daaff-d970-47e5-8892-3900b90f2524.lovable.app-1782569931016.png" },
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

  // Motion Framework: Cursor, Parallax, Magnetic hover, Card Glow effects
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Create Custom Cursor divs
    const cursor = document.createElement("div");
    cursor.className = "custom-cursor hidden md:block";
    const cursorRing = document.createElement("div");
    cursorRing.className = "custom-cursor-ring hidden md:block";
    document.body.appendChild(cursor);
    document.body.appendChild(cursorRing);

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;

      // Mouse Parallax updates
      const pxElements = document.querySelectorAll<HTMLElement>(".mouse-parallax");
      pxElements.forEach((el) => {
        const factor = parseFloat(el.getAttribute("data-parallax-factor") || "0.03");
        const x = (e.clientX - window.innerWidth / 2) * factor;
        const y = (e.clientY - window.innerHeight / 2) * factor;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });

      // Tech Card Glow mouse coordinate variable tracker
      const glowCards = document.querySelectorAll<HTMLElement>(".tech-card-glow");
      glowCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });
    };

    // Smooth follow loop for cursor ring
    const renderCursorRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursorRing);
    };
    const animId = requestAnimationFrame(renderCursorRing);

    // Scaling the cursor when hovering clickable links
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, .btn-primary, .btn-ghost, .btn-gold, .magnetic-wrap, [role='button']");
      if (interactive) {
        cursor.style.width = "20px";
        cursor.style.height = "20px";
        cursor.style.backgroundColor = "var(--emerald-deep)";
        cursorRing.style.width = "56px";
        cursorRing.style.height = "56px";
        cursorRing.style.borderColor = "var(--emerald-soft)";
      } else {
        cursor.style.width = "8px";
        cursor.style.height = "8px";
        cursor.style.backgroundColor = "var(--gold)";
        cursorRing.style.width = "40px";
        cursorRing.style.height = "40px";
        cursorRing.style.borderColor = "var(--gold-soft)";
      }
    };

    // Magnetic Wrap calculations
    const onWrapMove = (e: MouseEvent) => {
      const wrap = e.currentTarget as HTMLElement;
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const btn = wrap.querySelector<HTMLElement>(".magnetic-btn");
      if (btn) {
        btn.style.transform = `translate3d(${x * 0.4}px, ${y * 0.4}px, 0)`;
      }
      wrap.style.transform = `translate3d(${x * 0.2}px, ${y * 0.2}px, 0)`;
    };

    const onWrapLeave = (e: MouseEvent) => {
      const wrap = e.currentTarget as HTMLElement;
      const btn = wrap.querySelector<HTMLElement>(".magnetic-btn");
      if (btn) btn.style.transform = "translate3d(0, 0, 0)";
      wrap.style.transform = "translate3d(0, 0, 0)";
    };

    // Register active magnetic button listeners
    const scanMagnetic = () => {
      document.querySelectorAll<HTMLElement>(".magnetic-wrap").forEach((wrap) => {
        if (wrap.dataset.magneticActive === "true") return;
        wrap.addEventListener("mousemove", onWrapMove);
        wrap.addEventListener("mouseleave", onWrapLeave);
        wrap.dataset.magneticActive = "true";
      });
    };
    scanMagnetic();
    const mo = new MutationObserver(scanMagnetic);
    mo.observe(document.body, { childList: true, subtree: true });

    // Scroll progress drawing logic
    const onScroll = () => {
      const scrollY = window.scrollY;
      document.querySelectorAll<HTMLElement>(".parallax-bg").forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-scroll-speed") || "0.15");
        el.style.setProperty("--scroll-offset", `${scrollY * speed}px`);
      });

      document.querySelectorAll<HTMLElement>(".svg-draw-container").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const path = el.querySelector<SVGPathElement>(".svg-draw-path");
        if (path && rect.top < window.innerHeight && rect.bottom > 0) {
          const visiblePct = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
          const length = path.getTotalLength();
          path.style.strokeDashoffset = `${length * (1 - visiblePct)}`;
        }
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("scroll", onScroll);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("scroll", onScroll);
      mo.disconnect();
      document.body.removeChild(cursor);
      document.body.removeChild(cursorRing);
      document.querySelectorAll<HTMLElement>(".magnetic-wrap").forEach((wrap) => {
        wrap.removeEventListener("mousemove", onWrapMove);
        wrap.removeEventListener("mouseleave", onWrapLeave);
      });
    };
  }, []);

  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div key={pathname} className="page-transition-wrap">
          <Outlet />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

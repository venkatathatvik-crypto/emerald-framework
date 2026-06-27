import { useEffect, useRef, type ReactNode, type CSSProperties, type ElementType } from "react";

type Variant = "rise" | "rise-soft" | "fade" | "mask";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  variant?: Variant;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  once?: boolean;
}

export function Reveal({
  children,
  as: Tag = "div",
  variant = "rise",
  delay = 0,
  className,
  style,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in");
            if (once) io.unobserve(el);
          } else if (!once) {
            el.classList.remove("in");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref as never}
      data-reveal={variant}
      className={className}
      style={{ animationDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

export function RevealStagger({
  children,
  step = 80,
  className,
}: {
  children: ReactNode[];
  step?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} delay={i * step}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}

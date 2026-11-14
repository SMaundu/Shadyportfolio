import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { scrollToSection } from "@/lib/scroll";

interface SectionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Section id on the home page, e.g. "work". */
  to: string;
  /** Optional query string to carry (e.g. "service=logo-design"). */
  query?: string;
}

/**
 * Link to a section of the home page. Smooth-scrolls when already on "/",
 * otherwise navigates to "/#id" (ScrollManager finishes the scroll).
 */
export const SectionLink = forwardRef<HTMLAnchorElement, SectionLinkProps>(function SectionLink(
  { to, query, onClick, children, ...rest },
  ref,
) {
  const location = useLocation();
  const navigate = useNavigate();
  const search = query ? `?${query}` : "";
  const href = `/${search}#${to}`;

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (location.pathname === "/") {
      if (query) navigate({ pathname: "/", search, hash: `#${to}` }, { replace: true, preventScrollReset: true });
      else window.history.replaceState(null, "", `#${to}`);
      scrollToSection(to);
    } else {
      navigate(href);
    }
  };

  return (
    <Link ref={ref} to={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
});

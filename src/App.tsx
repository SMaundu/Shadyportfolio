import { AnimatePresence, MotionConfig } from "framer-motion";
import { lazy, Suspense, type ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/layout/PageTransition";
import { ScrollManager } from "@/components/layout/ScrollManager";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const Book = lazy(() => import("./pages/Book"));

function Page({ children }: { children: ReactNode }) {
  return (
    <PageTransition>
      <Suspense fallback={<div className="min-h-[100svh]" aria-busy="true" />}>{children}</Suspense>
    </PageTransition>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => {
        if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      }}
    >
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Index /></Page>} />
        <Route path="/work/:slug" element={<Page><ProjectPage /></Page>} />
        <Route path="/book" element={<Page><Book /></Page>} />
        <Route path="*" element={<Page><NotFound /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HelmetProvider>
        <BrowserRouter>
          <a
            href="#main"
            className="sr-only z-[80] rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            <AnimatedRoutes />
          </main>
          <Footer />
          <ScrollManager />
          <ScrollToTop />
        </BrowserRouter>
      </HelmetProvider>
    </MotionConfig>
  );
}

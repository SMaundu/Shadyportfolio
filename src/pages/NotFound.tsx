
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <h1 className="text-8xl font-bold text-burgundy">404</h1>
        <p className="text-2xl font-semibold mb-4">Page Not Found</p>
        <p className="text-foreground/70 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <a href="/" className="inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

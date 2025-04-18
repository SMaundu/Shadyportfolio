
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, Home, UserCircle, GraduationCap, Briefcase, Code, FileText } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface NavLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navLinks: NavLink[] = [
    { name: "Home", href: "#home", icon: <Home className="h-5 w-5" /> },
    { name: "About", href: "#about", icon: <UserCircle className="h-5 w-5" /> },
    { name: "Education", href: "#education", icon: <GraduationCap className="h-5 w-5" /> },
    { name: "Skills", href: "#skills", icon: <Code className="h-5 w-5" /> },
    { name: "Resume", href: "#resume", icon: <FileText className="h-5 w-5" /> }
  ];

  // Handle section navigation and highlighting
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const sections = document.querySelectorAll("section");
    
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id") || "";
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        setActiveSection(sectionId);
      }
    });
  };

  // Set up scroll event listener
  useState(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-col fixed left-6 top-1/2 transform -translate-y-1/2 z-50 border border-border rounded-full bg-background/80 backdrop-blur-md p-2 shadow-lg animate-fade-in">
        <ul className="flex flex-col space-y-3">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full transition-all",
                  activeSection === link.href.substring(1)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/60 hover:text-foreground hover:bg-muted"
                )}
              >
                {link.icon}
                <span className="sr-only">{link.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-background/80 backdrop-blur-md border border-border"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6 text-foreground" />
        ) : (
          <Menu className="h-6 w-6 text-foreground" />
        )}
        <span className="sr-only">Toggle menu</span>
      </button>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transform transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full w-64 bg-background/95 backdrop-blur-md border-r border-border shadow-xl p-5">
          <div className="flex flex-col h-full">
            <div className="mb-8 mt-10">
              <h2 className="text-2xl font-bold text-primary">Shadrack Maundu</h2>
              <p className="text-sm text-foreground/70">IT Professional</p>
            </div>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={cn(
                      "sidebar-link",
                      activeSection === link.href.substring(1) && "active-link"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-4 border-t border-border">
              <p className="text-xs text-foreground/60">
                &copy; {new Date().getFullYear()} Shadrack Maundu
              </p>
            </div>
          </div>
        </div>
      </div>

      <ThemeToggle />
    </>
  );
}

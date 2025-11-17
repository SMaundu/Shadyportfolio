import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { SectionContainer } from "@/components/SectionContainer";
import { AnimatedText } from "@/components/AnimatedText";
import { SkillCard } from "@/components/SkillCard";
import { TimelineItem } from "@/components/TimelineItem";
import { Button } from "@/components/ui/button";

import {
  Code,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Github,
  Linkedin,
  Laptop,
  Globe,
  BookOpen,
  PaintBucket,
  Monitor,
  Network,
  Instagram,
} from "lucide-react";


const Index = () => {
  // Add a scroll reveal effect for elements when they come into view
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Personal details
  const personalDetails = {
    name: "Shadrack Maundu Ndinda",
    title: "IT Professional & Developer",
    email: "shadrackmaundu2001@gmail.com",
    phone: "+254719300801",  
    nationality: "Kenyan",
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <SectionContainer id="home" className="relative">
       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 -z-10" />

      {/* Changed to max-w-6xl to give the 2 columns more space */}
      <div className="max-w-6xl mx-auto py-24 md:py-32 px-4"> {/* Added horizontal padding px-4 for mobile */}
        
        {/* This is the 2-column grid. It stacks on mobile and splits on 'lg' screens. */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* MOVED: All your text content is now in the first grid column */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                B.Sc. IT
              </span>
              <span className="text-foreground/60">
                 (JKUAT)
              </span>
            </div>

            <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl leading-tight">
              <AnimatedText text="Hi, I'm" className="block" />
              <AnimatedText
                text="Shadrack Maundu"
                className="bg-gradient-to-r from-gold to-burgundy text-transparent bg-clip-text block mt-2"
              />
            </h1>
            <h6 className="text-2xl md:text-2xl lg:text-4xl leading-tight">
              I bring ideas to life through design & code.
            </h6>

            <p className="text-xl text-foreground/80 max-w-2xl reveal opacity-0">
              An IT professional specializing in Graphics Design, Web
              development, programming, and mobile application development.
              Based in Kenya with a passion for creating innovative digital
              solutions.
            </p>

            <div className="flex flex-wrap gap-4 mt-4 reveal opacity-0">
              <Button
                size="lg"
                className="bg-burgundy text-white hover:bg-burgundy/90 px-6 py-3 rounded-md cursor-pointer" // Added styling for mock button
                asChild
              >
                <a href="#contact">Contact Me</a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-gold text-gold hover:bg-gold/10 px-6 py-3 rounded-md border cursor-pointer" // Added styling for mock button
                asChild
              >
                <a href="#contact">View Resume</a>
              </Button>
            </div>
          </div>

          {/* NEW: This is the second grid column for your image */}
          <div className="reveal opacity-0 flex justify-center items-center">
            {/* This div is the "rounded rectangle" frame */}
            <div className="bg-card p-2 rounded-2xl shadow-xl border border-border w-100 h-200 ">
              <img               
                src="/designs/Passport 2.jpg"
                alt="Shadrack Maundu"
                className="w-full h-auto object-cover rounded-xl" // The image itself is also rounded
              />
            </div>
          </div>
          
        </div>
      </div>
      </SectionContainer>

      {/* About Section */}
      <SectionContainer id="about" className="bg-muted/30 max-l-w-6xl mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">About Me</h2>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="reveal opacity-0">
              <h3 className="text-2xl font-semibold mb-4">Personal Details</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <div className="font-medium">Email</div>
                    <a
                      href={`mailto:${personalDetails.email}`}
                      className="text-foreground/80 hover:text-primary"
                    >
                      {personalDetails.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <a
                      href={`tel:${personalDetails.phone}`}
                      className="text-foreground/80 hover:text-primary"
                    >
                      {personalDetails.phone}
                    </a>
                  </div>
                </div>

                

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <div className="font-medium">Nationality</div>
                    <div className="text-foreground/80">
                      {personalDetails.nationality}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="reveal opacity-0">
              <h3 className="text-2xl font-semibold mb-4">
                Professional Profile
              </h3>
              <div className="space-y-4 text-foreground/80">
                <p>
                  I am an Information Technology Graduate at Jomo Kenyatta
                  University of Agriculture and Technology (JKUAT), where I
                  pursued a Bachelor of Science in Information Technology.
                </p>
                <p>
                  With a strong foundation in Graphics Design, Web development, programming, and
                  mobile app development, I bring technical expertise alongside
                  excellent communication skills. My educational background
                  includes strong performances in Mathematics, Physics, and
                  Computer Studies.
                </p>
                <p>
                  I am passionate about applying my skills to create innovative
                  technological solutions and continuously learning new
                  technologies in the ever-evolving IT landscape.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Education Section */}
      <SectionContainer id="education">
        <div className="max-w-15xl mx-auto">
          <h2 className="section-title">Education</h2>

          <div className="mt-8 space-y-2 reveal opacity-0">
            <TimelineItem
              date="2021 - 2025"
              title="Jomo Kenyatta University of Agriculture and Technology (JKUAT)"
              description={
                <>
                  <p className="mb-2">
                    Bachelor of Science in Information Technology (IT)
                  </p>
                 
                </>
              }
            />

            <TimelineItem
              date="2017 - 2020"
              title="Kenya Certificate of Secondary Education (KCSE)"
              description={
                <>
                  <p className="mb-2">Mean Grade: A- (minus) - 78 points</p>
                  
                </>
              }
            />

            <TimelineItem
              date="2008 - 2015"
              title="Kenya Certificate of Primary Education (KCPE)"
              description={
                <>
                  <p className="mb-2">Mean Grade: 352 out of 500</p>
                 
                </>
              }
            />
          </div>
        </div>
      </SectionContainer>

      {/* Skills Section */}
      <SectionContainer id="skills" className="bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">Skills & Expertise</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 stagger-animation">
            <SkillCard
              title="Computer Packages"
              icon={<Laptop className="h-6 w-6" />}
              description="Proficient in various computer software packages (e.g. Word, Excell, Powerpoint etc.) and office applications for efficient productivity."
            />

            <SkillCard
              title="Communication Skills"
              icon={<Globe className="h-6 w-6" />}
              description="Excellent written and verbal communication skills for effective team collaboration and client interaction."
            />

            <SkillCard
              title="Java Programming"
              icon={<Code className="h-6 w-6" />}
              description="Skilled in Java programming language for building robust and responsive desktop and Android applications."
            />

            <SkillCard
              title="Web Development"
              icon={<BookOpen className="h-6 w-6" />}
              description="Front-end web development skills including HTML, CSS, JavaScript, Typescript, Vite, TypeScript, React, Tailwind CSS for creating responsive websites among others."
            />

            <SkillCard
              title="Mobile Development"
              icon={<Monitor className="h-6 w-6" />}
              description="Experience with Dart/Flutter, Android Studio and Java for building mobile applications on the Android platform."
            />

            <SkillCard
              title="Graphics Design"
              icon={<PaintBucket className="h-6 w-6" />}
              description="Graphics design capabilities in the Adobe Suite. This involves design in Adobe Photoshop, Adobe Illustrator, Adobe Indesign among others such as the Canva."
            />
            <SkillCard
              title="Networking"
              icon={<Monitor className="h-6 w-6" />}
              description="Intermediate knowledge in Networking especially in the configuration of networks in a Local Area Network."
            />
            <SkillCard
              title="Digital Marketing"
              icon={<Globe className="h-6 w-6" />}
              description="My proficiency is in full-funnel content strategy. I design Seamless fliers, social media posts, brochures, and other marketing materials that align with brand identity and campaign goals."
            />
          </div>
        </div>
      </SectionContainer>

      <SectionContainer id="designs">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">Design Showcase</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 reveal opacity-0">
            {/* Poster 1 */}
            <div className="rounded-lg overflow-hidden shadow-md bg-card border border-border">
              <img
                src="/designs/Medical Camp 2.png"
                alt="Poster 1"
                className="w-full h-60 object-cover hover:scale-105 hover:brightness-90 transition-all duration-300"
              />
              <div className="p-4 text-center text-sm text-foreground/80">
                Medical Camp Poster
              </div>
            </div>
            {/* Poster 2 */}
            <div className="rounded-lg overflow-hidden shadow-md bg-card border border-border">
              <img
                src="/designs/Shirts Sale.png"
                alt="Poster 3"
                className="w-full h-60 object-cover  hover:scale-105 hover:brightness-90 transition-all duration-300"
              />
              <div className="p-4 text-center text-sm text-foreground/80">
                Shirt Sales Poster
              </div>
            </div>
            {/* Poster 3 */}
            <div className="rounded-lg overflow-hidden shadow-md bg-card border border-border">
              <img
                src="/designs/UET Cultural sunday2.png"
                alt="Poster 2"
                className="w-full h-60 object-cover hover:scale-105 hover:brightness-90 transition-all duration-300"
              />
              <div className="p-4 text-center text-sm text-foreground/80">
                UET Cultural Sunday
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                className="text-gold border-gold hover:bg-gold/10 hover:scale-105 hover:brightness-100 transition-all duration-300"
                asChild
              >
                <a
                  href="https://drive.google.com/drive/u/0/folders/1A9PQvmsnXmPIvzMUEeRUCWrQzOnZvHFm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View These and More Designs Here
                </a>
              </Button>
            </div>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer id="projects">
        <div className="max-w-4xl mx-auto mb-40 mt-3">
          <h2 className="section-title">Projects</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 reveal opacity-0">
            <div className="rounded-lg overflow-hidden shadow-md bg-card border border-border">
              <img
                src="/designs/project1.jpg"
                alt="Project 1"
                className=" w-full h-60 object-cover hover:scale-105 hover:brightness-90 transition-all duration-300 "
              />
              <h3 className="text-xl font-semibold text-center text-gold border-gold">
                QLessCommute
              </h3>
              <p className="text-white-700 text-center">
                An Uber-like Mobile app using QR code ticketing and M-Pesa
                integration.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-md bg-card border border-border">
              <img
                src="/designs/Portfolio.jpg"
                alt="Poster 3"
                className="w-full h-60 object-cover  hover:scale-105 hover:brightness-90 transition-all duration-300"
              />
              <h3 className="text-xl font-semibold text-center text-gold">
                Portfolio Website
              </h3>
              <div className="text-white-700 text-center">
                A responsive personal site built with React, Vite, and Tailwind
                CSS.
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-md bg-card border border-border">
              <img
                src="/designs/doc.png"
                alt="Poster 3"
                className="w-full h-60 object-cover  hover:scale-105 hover:brightness-90 transition-all duration-300"
              />
              <h3 className="text-xl font-semibold text-center text-gold">
                Health Management IS
              </h3>
              <div className="text-white-700 text-center">
              A simple web application that simulates a basic health information system.
              </div>
            </div>      
          </div>
        </div>
      </SectionContainer>

      {/* Contact Section */}
      <SectionContainer id="contact" className="bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">Contact Me</h2>

          <div className="grid md:grid-cols-2 gap-10 mt-8">
            <div className="reveal opacity-0">
              <h3 className="text-2xl font-semibold mb-6">Get In Touch</h3>

              <div className="space-y-6">
                <p className="text-foreground/80">
                  Feel free to reach out to me for any inquiries, project
                  collaborations, or professional opportunities. I am always
                  open to discussing new challenges.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-foreground/70">Email</div>
                      <a
                        href={`mailto:${personalDetails.email}`}
                        className="font-medium hover:text-primary"
                      >
                        {personalDetails.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-foreground/70">Phone</div>
                      <a
                        href={`tel:${personalDetails.phone}`}
                        className="font-medium hover:text-primary"
                      >
                        {personalDetails.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Github className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-foreground/70">GitHub</div>
                      <a
                        href="https://github.com/SMaundu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-primary"
                      >
                        github.com/SMaundu
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Linkedin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-foreground/70">LinkedIn</div>
                      <a
                        href="https://www.linkedin.com/in/shadrack-maundu-892130228/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-primary"
                      >
                        linkedin.com/in/shadrack-maundu
                      </a>
                    </div>
                    
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Instagram className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-foreground/70">Instagram</div>
                      <a
                        href="https://www.instagram.com/maundu_shady/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-primary"
                      >
                      maundu_shady
                      </a>
                    </div>
                    
                  </div>
                  
                </div>
                 <div className="mt-8 flex justify-center">
                <a
                  href="/designs/Shadrack_Maundu_CV.pdf"
                  download
                  className="bg-burgundy hover:bg-burgundy/90 text-white px-20 py-2 rounded-lg">
                  Download Full Resume (PDF)
                </a>
              </div>
              </div>
            </div>

            <div className="reveal opacity-0">
              <div className="animated-border rounded-lg overflow-hidden">
                <div className="bg-card p-6">
                  <h3 className="text-xl font-semibold mb-4">Send a Message</h3>

                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-1"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-1"
                      >
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium mb-1"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full px-4 py-2 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your message here..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-burgundy hover:bg-burgundy/90 text-white"
                    >
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Footer */}
      <footer className="py-6 px-6 md:px-12 lg:px-24 border-t border-border bg-background">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-primary">
              Shadrack Maundu
            </h3>
            <p className="text-sm text-foreground/60">
              Graphics Designer, IT Professional & Software Developer
            </p>
          </div>

          <div className="text-sm text-foreground/60">
            &copy; Built By Shadrack Maundu. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

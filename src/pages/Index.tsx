
import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { SectionContainer } from "@/components/SectionContainer";
import { AnimatedText } from "@/components/AnimatedText";
import { SkillCard } from "@/components/SkillCard";
import { TimelineItem } from "@/components/TimelineItem";
import { Button } from "@/components/ui/button";
import { 
  Code, Mail, Phone, MapPin, Calendar, FileText, 
  Laptop, Globe, BookOpen, PaintBucket, Monitor, Network 
} from "lucide-react";

const Index = () => {
  // Add a scroll reveal effect for elements when they come into view
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  // Personal details 
  const personalDetails = {
    name: "Shadrack Maundu Ndinda",
    title: "IT Professional & Developer",
    email: "shadrackmaundu2001@gmail.com",
    phone: "+254719300801",
    dob: "4th December 2001",
    id: "39401611",
    nationality: "Kenyan"
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <SectionContainer id="home" className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 -z-10" />
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                B.Sc. Information Technology
              </span>
              <span className="text-foreground/60">Jomo Kenyatta University</span>
            </div>

            <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl leading-tight">
              <AnimatedText text="Hi, I'm" className="block" />
              <AnimatedText 
                text="Shadrack Maundu" 
                className="bg-gradient-to-r from-gold to-burgundy text-transparent bg-clip-text block mt-2" 
              />
            </h1>
            
            <p className="text-xl text-foreground/80 max-w-2xl reveal opacity-0">
              An IT professional specializing in web development, programming, and mobile application development. 
              Based in Kenya with a passion for creating innovative digital solutions.
            </p>

            <div className="flex flex-wrap gap-4 mt-4 reveal opacity-0">
              <Button 
                size="lg" 
                className="bg-burgundy text-white hover:bg-burgundy/90"
                asChild
              >
                <a href="#contact">Contact Me</a>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-gold text-gold hover:bg-gold/10"
                asChild
              >
                <a href="#resume">View Resume</a>
              </Button>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* About Section */}
      <SectionContainer id="about" className="bg-muted/30">
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
                    <a href={`mailto:${personalDetails.email}`} className="text-foreground/80 hover:text-primary">
                      {personalDetails.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <a href={`tel:${personalDetails.phone}`} className="text-foreground/80 hover:text-primary">
                      {personalDetails.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <div className="font-medium">Date of Birth</div>
                    <div className="text-foreground/80">{personalDetails.dob}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <div className="font-medium">ID Number</div>
                    <div className="text-foreground/80">{personalDetails.id}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <div className="font-medium">Nationality</div>
                    <div className="text-foreground/80">{personalDetails.nationality}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="reveal opacity-0">
              <h3 className="text-2xl font-semibold mb-4">Professional Profile</h3>
              <div className="space-y-4 text-foreground/80">
                <p>
                  I am an Information Technology student at Jomo Kenyatta University of Agriculture and Technology (JKUAT),
                  where I'm pursuing a Bachelor of Science in Information Technology.
                </p>
                <p>
                  With a strong foundation in web development, programming, and mobile app development,
                  I bring technical expertise alongside excellent communication skills. My educational
                  background includes strong performances in Mathematics, Physics, and Computer Studies.
                </p>
                <p>
                  I am passionate about applying my skills to create innovative technological solutions
                  and continuously learning new technologies in the ever-evolving IT landscape.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Education Section */}
      <SectionContainer id="education">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">Education</h2>
          
          <div className="mt-8 space-y-2 reveal opacity-0">
            <TimelineItem
              date="2021 - Present"
              title="Jomo Kenyatta University of Agriculture and Technology (JKUAT)"
              description={
                <>
                  <p className="mb-2">Bachelor of Science in Information Technology (IT)</p>
                  <div className="text-sm text-foreground/70 italic">Current enrollment</div>
                </>
              }
            />
            
            <TimelineItem
              date="2017 - 2020"
              title="Kenya Certificate of Secondary Education (KCSE)"
              description={
                <>
                  <p className="mb-2">Mean Grade: A- (minus) - 78 points</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Mathematics A</li>
                    <li>English A-</li>
                    <li>Kiswahili A</li>
                    <li>Physics A-</li>
                    <li>Chemistry B</li>
                    <li>Geography A-</li>
                    <li>Christian Religious Education A-</li>
                    <li>Business Studies A-</li>
                  </ul>
                </>
              }
            />
            
            <TimelineItem
              date="2008 - 2015"
              title="Kenya Certificate of Primary Education (KCPE)"
              description={
                <>
                  <p className="mb-2">Mean Grade: 352 out of 500</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Mathematics A-</li>
                    <li>English Language B</li>
                    <li>Kiswahili B</li>
                    <li>Science B+</li>
                    <li>Social Studies and Religious Education B+</li>
                  </ul>
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
              description="Experience with Android Studio and Java for building mobile applications on the Android platform."
            />
            
            <SkillCard 
              title="Design & Networking" 
              icon={<PaintBucket className="h-6 w-6" />}
              description="Graphics design capabilities in the Adobe Suite. This involves design in Adobe Photoshop, Adobe Illustrator among others such as the Canva."
            />
            <SkillCard 
              title="Networking" 
              icon={<Monitor className="h-6 w-6" />}
              description="Intermediate knowledge in Networking especially in the configuration of networks in a Local Area Network."
            />
            
          </div>
        </div>
      </SectionContainer>

      {/* Resume Section */}
      <SectionContainer id="resume">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title">Resume</h2>
          
          <div className="mt-8 reveal opacity-0">
            <div className="p-6 bg-card rounded-lg shadow-sm border border-border">
              <h3 className="text-2xl font-bold mb-6">CURRICULUM VITAE</h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-burgundy">PERSONAL DETAILS</h4>
                  <ul className="space-y-2">
                    <li><span className="font-medium">NAME:</span> {personalDetails.name}</li>
                    <li><span className="font-medium">EMAIL:</span> {personalDetails.email}</li>
                    <li><span className="font-medium">DATE OF BIRTH:</span> {personalDetails.dob}</li>
                    <li><span className="font-medium">PHONE NUMBER:</span> {personalDetails.phone}</li>
                    <li><span className="font-medium">ID NUMBER:</span> {personalDetails.id}</li>
                    <li><span className="font-medium">NATIONALITY:</span> {personalDetails.nationality}</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-burgundy">EDUCATION</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium">2021 – Present: Jomo Kenyatta University of Agriculture and Technology (JKUAT)</h5>
                      <p className="ml-6">• Bachelor of Science in Information Technology (IT)</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium">2017 – 2020: Kenya Certificate of Secondary Education (KCSE)</h5>
                      <ul className="ml-6 space-y-1">
                        <li>• Mean Grade: A- (minus) – 78 points</li>
                        <li>• (Mathematics A, English A-, Kiswahili A, Physics A-, Chemistry B, Geography A-, Christian Religious Education A-, Business Studies A-)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium">2008-2015: Kenya Certificate of Primary Education (KCPE)</h5>
                      <ul className="ml-6 space-y-1">
                        <li>• Mean Grade: 352 out of 500</li>
                        <li>• (Mathematics A-, English Language B, Kiswahili B, Science B+, Social Studies and Religious Education B+)</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-burgundy">SKILLS</h4>
                  
                  <ul className="space-y-2 ml-6">
                    <li>a. Computer skills in computer packages</li>
                    <li>b. Excellent communication skills in writing and face-to-face</li>
                    <li>c. Programming Languages: Java</li>
                    <li>d. Web Development (Front End developer) – HTML, CSS, JavaScript</li>
                    <li>e. Mobile development – Android Studio (Java)</li>
                    <li>f. Intermediate knowledge in Networking</li>
                    <li>g. Graphics design</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <Button className="bg-burgundy hover:bg-burgundy/90 text-white">
                  Download Full Resume (PDF)
                </Button>
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
                  Feel free to reach out to me for any inquiries, project collaborations, 
                  or professional opportunities. I am always open to discussing new challenges.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-foreground/70">Email</div>
                      <a href={`mailto:${personalDetails.email}`} className="font-medium hover:text-primary">
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
                      <a href={`tel:${personalDetails.phone}`} className="font-medium hover:text-primary">
                        {personalDetails.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="reveal opacity-0">
              <div className="animated-border rounded-lg overflow-hidden">
                <div className="bg-card p-6">
                  <h3 className="text-xl font-semibold mb-4">Send a Message</h3>
                  
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
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
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
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
                      <label htmlFor="message" className="block text-sm font-medium mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full px-4 py-2 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your message here..."
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-burgundy hover:bg-burgundy/90 text-white">
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
            <h3 className="text-lg font-semibold text-primary">Shadrack Maundu</h3>
            <p className="text-sm text-foreground/60">IT Professional & Developer</p>
          </div>
          
          <div className="text-sm text-foreground/60">
            &copy; {new Date().getFullYear()} Shadrack Maundu. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

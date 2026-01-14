import React from "react";
import { SectionContainer } from "@/components/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Github, Linkedin, Instagram } from "lucide-react";

export function ContactContainer() {
  const personalDetails = {
    email: "shadrackmaundu2001@gmail.com",
    phone: "+254719300801",
  };

  return (
    <SectionContainer id="contact" className="bg-muted/30">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="section-title">Contact Me</h2>

        <div className="grid md:grid-cols-2 gap-10 mt-8">
          <div className="reveal opacity-0">
            <h3 className="text-2xl font-semibold mb-6">Get In Touch</h3>

            <div className="space-y-6">
              <p className="text-foreground/80">Feel free to reach out to me for any inquiries, project collaborations, or professional opportunities. I am always open to discussing new challenges.</p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-foreground/70">Email</div>
                    <a href={`mailto:${personalDetails.email}`} className="font-medium hover:text-primary">{personalDetails.email}</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-foreground/70">Phone</div>
                    <a href={`tel:${personalDetails.phone}`} className="font-medium hover:text-primary">{personalDetails.phone}</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Github className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-foreground/70">GitHub</div>
                    <a href="https://github.com/SMaundu" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary">github.com/SMaundu</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Linkedin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-foreground/70">LinkedIn</div>
                    <a href="https://www.linkedin.com/in/shadrack-maundu-892130228/" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary">linkedin.com/in/shadrack-maundu</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Instagram className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-foreground/70">Instagram</div>
                    <a href="https://www.instagram.com/maundu_shady/" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary">maundu_shady</a>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <a href="/designs/Shadrack_Maundu_CV.pdf" download className="bg-burgundy hover:bg-burgundy/90 text-white px-20 py-2 rounded-lg">Download Full Resume (PDF)</a>
              </div>
            </div>
          </div>

          <div className="reveal opacity-0">
            <div className="animated-border rounded-lg overflow-hidden">
              <div className="bg-card p-6">
                <h3 className="text-xl font-semibold mb-4">Send a Message</h3>

                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                    <input type="text" id="name" className="w-full px-4 py-2 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="John Doe" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Your Email</label>
                    <input type="email" id="email" className="w-full px-4 py-2 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="john@example.com" />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                    <textarea id="message" rows={4} className="w-full px-4 py-2 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Your message here..." />
                  </div>

                  <Button type="submit" className="w-full bg-burgundy hover:bg-burgundy/90 text-white">Send Message</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

export default ContactContainer;

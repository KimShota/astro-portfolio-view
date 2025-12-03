import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Github, Linkedin, Twitter } from 'lucide-react';
import StarField from '@/components/StarField';
import { Button } from '@/components/ui/button';

const skills = [
  { category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion'] },
  { category: 'Backend', items: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'GraphQL'] },
  { category: 'Design', items: ['Figma', 'Adobe XD', 'UI/UX', 'Prototyping', 'Design Systems'] },
  { category: 'Tools', items: ['Git', 'Docker', 'AWS', 'Vercel', 'CI/CD'] },
];

const socialLinks = [
  { name: 'Email', icon: Mail, href: 'mailto:hello@example.com' },
  { name: 'GitHub', icon: Github, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
];

const Who = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <StarField starCount={150} />

      {/* Back button */}
      <motion.button
        className="fixed top-6 left-6 z-40 p-3 rounded-full border-2 border-foreground/50 hover:border-foreground hover:bg-foreground/10 transition-all"
        onClick={() => navigate('/universe')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </motion.button>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Hero section */}
        <section className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 py-20 lg:py-10 gap-10 lg:gap-20">
          {/* Photo */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/30 glow-gold">
                <div className="w-full h-full bg-gradient-to-br from-cosmos-purple to-cosmos-blue flex items-center justify-center">
                  <span className="font-display text-6xl text-foreground/50">YN</span>
                </div>
              </div>
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border border-primary/20 scale-110 animate-pulse-glow" />
            </div>
          </motion.div>

          {/* Introduction */}
          <motion.div
            className="max-w-xl text-center lg:text-left"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide mb-4">
              <span className="text-foreground">Hello, I'm</span>
              <br />
              <span className="text-gradient-gold">Your Name</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-6">
              A passionate developer and designer creating digital experiences that blend 
              creativity with technology. I specialize in building beautiful, functional 
              web applications that leave lasting impressions.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
              With over 5 years of experience in the industry, I've had the privilege 
              of working with startups and established companies alike, turning ideas 
              into reality through code and design.
            </p>
          </motion.div>
        </section>

        {/* Skills & Contact section */}
        <section className="min-h-screen flex flex-col lg:flex-row items-start justify-center px-6 py-20 gap-10 lg:gap-20 max-w-7xl mx-auto">
          {/* Skills */}
          <motion.div
            className="flex-1 w-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-8 tracking-wide">
              Skills & <span className="text-primary">Expertise</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills.map((skillGroup, index) => (
                <motion.div
                  key={skillGroup.category}
                  className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="font-display text-lg text-accent mb-4 tracking-wider">
                    {skillGroup.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-sm bg-muted/50 rounded-full text-foreground/80 border border-border/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            className="flex-1 w-full lg:max-w-md"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-8 tracking-wide">
              Get in <span className="text-primary">Touch</span>
            </h2>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border/50">
              <p className="text-muted-foreground mb-8 leading-relaxed">
                I'm always open to discussing new projects, creative ideas, or opportunities 
                to be part of your vision. Feel free to reach out!
              </p>

              {/* Social links */}
              <div className="flex flex-wrap gap-4 mb-8">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="p-3 rounded-full bg-muted/50 hover:bg-primary/20 hover:border-primary border border-border/50 transition-all group"
                    title={link.name}
                  >
                    <link.icon className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>

              {/* CTA */}
              <Button variant="cosmos" size="lg" className="w-full" asChild>
                <a href="mailto:hello@example.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Send me a message
                </a>
              </Button>
            </div>

            {/* Back to universe link */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="cosmosOutline"
                onClick={() => navigate('/universe')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Universe
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Who;

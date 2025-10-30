import React, { useState, useRef, useEffect } from 'react';
import {
  Briefcase,
  Lightbulb,
  BarChart2,
  Cpu,
  GraduationCap,
  Mail,
  Linkedin,
  Github,
  Instagram,
  ChevronUp,
  X,
  Send,
  User,
  MessageSquare
} from 'lucide-react';

// --- YOUR CUSTOM DATA HERE ---
// This object holds all the text content for your portfolio.
// Update this section to change the content across the site.
const portfolioData = {
  name: "Muhammad Iqbal",
  tagline: "Autonomous AI Agent Engineer | NLP & RAG Specialist | Data Scientist",
  bio: [
    "A highly motivated and results-oriented Data Scientist with a passion for building intelligent and autonomous AI agents. Recently completed 'The Complete Agentic AI Engineering Course,' gaining hands-on experience in designing, building, and deploying autonomous agents using cutting-edge frameworks like OpenAI Agents SDK, CrewAI, LangGraph, and AutoGen.",
    "Proven ability to apply Agentic AI to solve real-world commercial problems and architect robust and scalable AI solutions. My expertise lies in connecting LLMs with proven design patterns to solve complex problems, from RAG prototypes to multi-agent financial simulators."
  ],
  skills: [
    { name: "Agentic AI", icon: <Cpu /> },
    { name: "Multi-agent Systems", icon: <Cpu /> },
    { name: "LangGraph / CrewAI", icon: <Cpu /> },
    { name: "RAG", icon: <Cpu /> },
    { name: "NLP", icon: <Cpu /> },
    { name: "Predictive Analytics", icon: <BarChart2 /> },
    { name: "Python", icon: <Cpu /> },
    { name: "SQL", icon: <BarChart2 /> },
    { name: "Data Visualization", icon: <BarChart2 /> },
    { name: "Tableau / Power BI", icon: <BarChart2 /> },
    { name: "Machine Learning", icon: <Cpu /> },
    { name: "Feature Engineering", icon: <Cpu /> },
  ],
  experiences: [
    {
      role: "Data Scientist Intern",
      company: "The House of Representatives, Republic of Indonesia (DPR RI)",
      period: "April 2025 – Present",
      points: [
        "Conducted socioeconomic analysis on <strong>SUSENAS</strong> data to support policy recommendations through Python-based data wrangling, visualization, and dashboard reporting.",
        "Performed <strong>NLP</strong> on Mahkamah Konstitusi verdicts to extract key constitutional issues and identify trends in judicial review cases.",
        "Built a <strong>Retrieval-Augmented Generation (RAG)</strong> prototype to enhance legal document search and summarization for legislative insight.",
        "Leveraged <strong>Dify.AI and n8n</strong> to build no-code RAG workflows, enabling efficient legal content retrieval and autonomous document summarization with a user-friendly UI."
      ]
    },
    {
      role: "AI Engineering for Corporate Training (Project-Based)",
      company: "RevoU | Client: Jalin",
      period: "Aug 2025 – Present",
      points: [
        "Spearheaded Jalin’s first corporate <strong>AI Engineering</strong> training, guiding non-developer employees to build AI agents for their daily tasks.",
        "Taught participants to design and automate workflows with no-code tools (Zapier, n8n), apply prompt engineering, and deploy chatbots to Telegram, Slack, and WhatsApp.",
        "Guided participants through assignments (individual & group), led technical simulations, and facilitated discussions via online channels."
      ]
    }
  ],
  projects: [
    {
      title: "Career Digital Twin (RAG Chatbot)",
      description: "Built and deployed a personal agent to represent my skills and experience to potential employers, automating the initial stages of job applications.",
      demoUrl: "https://huggingface.co/spaces/Shiverion/career_conversations",
      repoUrl: "https://github.com/Shiverion/Resume-chatbot-with-RAG"
    },
    {
      title: "Trader Agent Simulator – Autonomous Portfolio Management",
      description: "Built an intelligent trader agent using the <strong>OpenAI Agents SDK</strong>, capable of alternating between trading and rebalancing its portfolio using real-time insights from a researcher agent. Leveraged advanced async context management for clean multi-server handling, and integrated support for multiple LLM providers (OpenAI, DeepSeek, Google, Anthropic).",
      demoUrl: null,
      repoUrl: null
    },
    {
      title: "Indonesian Parliament Activity Chatbot",
      description: "This project implements a chatbot that can answer questions about the activities and agendas of the Indonesian Parliament members. It utilizes a SQL database containing agenda data and leverages large language models (LLMs) through the <strong>Langchain</strong> library to interact with the database and provide natural language responses.",
      demoUrl: null,
      repoUrl: null
    },
    {
      title: "Telco Churn Analysis",
      description: "Developed a churn prediction model using <strong>AllKNN</strong> with hyperparameter tuning, focused on minimizing false negatives. Achieved <strong>93.7% recall</strong>, reducing potential high-risk churn losses by $18.8K and cutting total misclassification costs by $48.5K, outperforming benchmark models like XGBoost and Random Forest.",
      demoUrl: null,
      repoUrl: "https://github.com/Shiverion/Telcho-Churn-Analysis"
    },
    {
      title: "Airbnb Data Analysis",
      description: "Analyzed Airbnb listings in Bangkok to identify peak-season revenue opportunities for December. Implemented dynamic pricing, extended-stay discounts, and last-minute deals. These optimizations increased total December revenue by <strong>7.6%</strong>, generating an additional <strong>฿3.9 million</strong> in high-demand areas.",
      demoUrl: null,
      repoUrl: "https://github.com/Shiverion/AirBnB-Data-Analysis"
    }
  ],
  education: [
    {
      institution: "Purwadhika Digital Technology School",
      degree: "Data Analysis and Machine Learning Modules",
      period: "Oct 2024 – Feb 2025"
    },
    {
      institution: "University of Brawijaya",
      degree: "Bachelor of Science in Physics (Material Science)",
      period: "Aug 2019 – Dec 2023"
    }
  ],
  certifications: [
    {
      name: "Agentic AI Engineering",
      issuer: "Udemy",
      date: "Issued July 2025"
    },
    {
      name: "Artificial Intelligence",
      issuer: "Kominfo’s Digital Talent Scholarship",
      date: "Issued Sep 2023"
    },
    {
      name: "Metaverse Engineering",
      issuer: "Kominfo’s Digital Talent Scholarship",
      date: "Issued April 2023"
    },
    {
      name: "Data Science & AI",
      issuer: "DQLab",
      date: "Issued 2020 – 2022"
    }
  ],
  contactEmail: "miqbal.izzulhaq@gmail.com",
  socialLinks: {
    linkedin: "https://www.linkedin.com/in/izzulhaq-iqbal/",
    github: "https://github.com/Shiverion",
    huggingface: "https://huggingface.co/spaces/Shiverion/career_conversations",
    medium: "https://medium.com/@miqbal.izzulhaq",
    instagram: "https://www.instagram.com/izzulhaq_iqbal/"
  },
  copyrightName: "Muhammad Iqbal Hilmy Izzulhaq"
};

// --- GEMINI API AGENT ---
// This is the system prompt that defines your AI Agent's persona and knowledge.
// It's pre-loaded with your CV data.
const AGENT_SYSTEM_PROMPT = `You are "Career-Twin," a professional AI Agent representing Muhammad Iqbal Hilmy Izzulhaq. Your personality is helpful, professional, and highly knowledgeable about Iqbal's skills. Your goal is to answer questions from recruiters and visitors about Iqbal's professional background.

**STRICT RULES:**
1.  **NEVER** break character. You are Iqbal's agent.
2.  **ONLY** answer questions related to Muhammad Iqbal's professional life, skills, projects, and experience based *only* on the context provided below.
3.  If a user asks an unrelated question (e.g., "what is the weather," "who are you," "tell me a joke"), you MUST politely decline and steer the conversation back to Iqbal's qualifications. Example: "My apologies, but my function is to provide information about Muhammad Iqbal's professional background. Do you have any questions about his AI projects or data science experience?"
4.  Keep answers concise, professional, and factual.

**MUHAMMAD IQBAL'S CV CONTEXT:**

* **Role:** Autonomous AI Agent Engineer, NLP & RAG Specialist, Data Scientist.
* **Summary:** Highly motivated Data Scientist passionate about building intelligent, autonomous AI agents. Experienced in frameworks like OpenAI Agents SDK, CrewAI, LangGraph, and AutoGen.
* **Core Skills:** Agentic AI, Multi-agent Systems, LangGraph, CrewAI, RAG, NLP, Predictive Analytics, Python, SQL, Data Visualization (Tableau, Power BI), Machine Learning.

* **Experience 1: Data Scientist Intern @ The House of Representatives, Republic of Indonesia (DPR RI) (April 2025 – Present)**
    * Analyzed SUSENAS data for policy recommendations (Python, visualization, dashboards).
    * Performed NLP on Mahkamah Konstitusi verdicts to identify trends.
    * Built a RAG prototype for legal document search and summarization.
    * Used Dify.AI and n8n for no-code RAG workflows.

* **Experience 2: AI Engineering for Corporate Training @ RevoU (Client: Jalin) (Aug 2025 – Present)**
    * Led Jalin's first corporate AI Engineering training for non-developers.
    * Taught no-code tools (Zapier, n8n), prompt engineering, and chatbot deployment (Telegram, Slack, WhatsApp).
    * Guided assignments, led technical simulations, and reported on performance.

* **Key Projects:**
    1.  **Career Digital Twin (RAG Chatbot):** A personal agent to represent his skills to employers.
    2.  **Trader Agent Simulator:** An autonomous trader agent (OpenAI Agents SDK) that uses a researcher agent for real-time insights and supports multiple LLM providers (OpenAI, DeepSeek, Google, Anthropic).
    3.  **Indonesian Parliament Activity Chatbot:** A Langchain-based chatbot that queries a SQL database of parliament agendas.
    4.  **Telco Churn Analysis:** A predictive model (AllKNN) that achieved 93.7% recall, saving $18.8K in potential high-risk churn.
    5.  **Airbnb Data Analysis:** Optimized pricing models to increase December revenue by 7.6% (฿3.9 million).

* **Education:**
    * Purwadhika Digital Technology School (Data Analysis & Machine Learning)
    * University of Brawijaya (B.S. in Physics)

* **Certifications:**
    * Agentic AI Engineering (Udemy, July 2025)
    * Artificial Intelligence (Kominfo, Sep 2023)
    * Metaverse Engineering (Kominfo, April 2023)
    * Data Science & AI (DQLab, 2020 – 2022)
`;

// --- MAIN APPLICATION ---

/**
 * Main App Component
 * Manages page state and navigation.
 */
export default function App() {
  const [currentPage, setCurrentPage] = useState('Hero');
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen font-sans antialiased relative">
      <Header currentPage={currentPage} navigateTo={navigateTo} />
      
      <main className="pt-20">
        <PageContainer 
          currentPage={currentPage} 
          navigateTo={navigateTo} 
          openAgentModal={() => setIsAgentModalOpen(true)}
        />
      </main>
      
      <Footer navigateTo={navigateTo} />

      {isAgentModalOpen && (
        <AgentChatModal closeModal={() => setIsAgentModalOpen(false)} />
      )}
    </div>
  );
}

// --- NAVIGATION & LAYOUT ---

/**
 * Header Component
 * Displays navigation links and logo.
 */
const Header = ({ currentPage, navigateTo }) => {
  const NavLink = ({ page, children }) => (
    <button
      onClick={() => navigateTo(page)}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        currentPage === page
          ? 'bg-sky-600 text-white'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-950 bg-opacity-80 backdrop-blur-md z-50 border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <button
              onClick={() => navigateTo('Hero')}
              className="text-2xl font-bold text-white transition-opacity hover:opacity-80"
            >
              {portfolioData.name}.
            </button>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink page="Hero">Home</NavLink>
              <NavLink page="About">About</NavLink>
              <NavLink page="Experience">Experience</NavLink>
              <NavLink page="Projects">Projects</NavLink>
              <NavLink page="Education">Education</NavLink>
              <NavLink page="Contact">Contact</NavLink>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

/**
 * PageContainer Component
 * Renders the correct page based on the current state.
 */
const PageContainer = ({ currentPage, navigateTo, openAgentModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  let pageContent;
  switch (currentPage) {
    case 'Hero':
      pageContent = <Hero navigateTo={navigateTo} openAgentModal={openAgentModal} />;
      break;
    case 'About':
      pageContent = <About />;
      break;
    case 'Experience':
      pageContent = <Experience />;
      break;
    case 'Projects':
      pageContent = <Projects />;
      break;
    case 'Education':
      pageContent = <Education />;
      break;
    case 'Contact':
      pageContent = <Contact />;
      break;
    default:
      pageContent = <Hero navigateTo={navigateTo} openAgentModal={openAgentModal} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {pageContent}
      {isScrolled && (
        <button
          onClick={() => navigateTo('Hero')}
          className="fixed bottom-6 right-6 bg-sky-600 text-white p-3 rounded-full shadow-lg transition-transform hover:bg-sky-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-950 z-50"
          aria-label="Back to Top"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

/**
 * Footer Component
 * Displays copyright and social media links.
 */
const Footer = ({ navigateTo }) => {
  const { socialLinks, copyrightName } = portfolioData;

  const SocialIcon = ({ href, 'aria-label': ariaLabel, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="text-gray-400 hover:text-sky-400 transition-colors"
    >
      {children}
    </a>
  );

  const TextLink = ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-medium text-gray-400 hover:text-sky-400 transition-colors"
    >
      {children}
    </a>
  );

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        <div className="flex justify-center space-x-6">
          <SocialIcon href={socialLinks.linkedin} aria-label="LinkedIn">
            <Linkedin className="h-6 w-6" />
          </SocialIcon>
          <SocialIcon href={socialLinks.github} aria-label="GitHub">
            <Github className="h-6 w-6" />
          </SocialIcon>
          <SocialIcon href={socialLinks.instagram} aria-label="Instagram">
            <Instagram className="h-6 w-6" />
          </SocialIcon>
          <TextLink href={socialLinks.huggingface}>Hugging Face</TextLink>
          <TextLink href={socialLinks.medium}>Medium</TextLink>
        </div>
        <div className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} {copyrightName}.
        </div>
      </div>
    </footer>
  );
};

// --- PAGE COMPONENTS ---

/**
 * Hero (Home) Page
 * Main landing view with tagline and photo.
 */
const Hero = ({ navigateTo, openAgentModal }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[70vh] py-20">
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Background Gradient */}
        <div className="absolute -top-40 -left-40 w-72 h-72 md:w-96 md:h-96 bg-sky-700 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-72 h-72 md:w-96 md:h-96 bg-indigo-700 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
            Hello, I'm <span className="text-sky-400">{portfolioData.name}</span>.
          </h1>
          <h2 className="mt-6 mb-16 text-xl sm:text-2xl md:text-3xl font-medium text-gray-300 max-w-3xl mx-auto">
            {portfolioData.tagline}
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigateTo('About')}
              className="px-8 py-3 bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-950"
            >
              View My Work
            </button>
            <button
              onClick={openAgentModal}
              className="px-8 py-3 bg-gray-800 text-sky-400 text-lg font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-950"
            >
              Ask My Agent ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Section Component
 * Wrapper for consistent page section styling.
 */
const Section = ({ title, icon, children }) => (
  <section className="mb-20 animate-fadeIn">
    <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 flex items-center">
      {React.cloneElement(icon, { className: 'w-8 h-8 mr-4 text-sky-400' })}
      {title}
    </h2>
    <div className="border-l-4 border-sky-600 pl-8">
      {children}
    </div>
  </section>
);

/**
 * About Page
 * Displays bio and skills.
 */
const About = () => (
  <div className="animate-fadeIn">
    <section className="mb-20">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
        About Me
      </h2>
      <div className="space-y-6 text-lg text-gray-300 max-w-3xl">
        {portfolioData.bio.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
    
    <section>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
        Core Skills
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {portfolioData.skills.map((skill, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center text-center transition-transform transform hover:-translate-y-2 hover:shadow-sky-500/20"
          >
            {React.cloneElement(skill.icon, { className: 'w-10 h-10 mb-4 text-sky-400' })}
            <span className="text-base font-medium text-white">{skill.name}</span>
          </div>
        ))}
      </div>
    </section>
  </div>
);

/**
 * Experience Page
 * Displays work experience timeline.
 */
const Experience = () => (
  <Section title="Working Experience" icon={<Briefcase />}>
    <div className="space-y-12">
      {portfolioData.experiences.map((job, index) => (
        <div key={index} className="relative">
          <div className="absolute -left-[3.2rem] top-1 w-6 h-6 bg-sky-600 rounded-full border-4 border-gray-950"></div>
          <h3 className="text-2xl font-semibold text-white">{job.role}</h3>
          <p className="text-lg text-sky-400 mb-2">{job.company}</p>
          <p className="text-sm text-gray-400 mb-4">{job.period}</p>
          <ul className="list-disc list-outside space-y-3 text-gray-300 text-lg pl-5">
            {job.points.map((point, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: point }} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  </Section>
);

/**
 * Projects Page
 * Displays featured projects.
 */
const Projects = () => (
  <Section title="Featured Projects" icon={<Lightbulb />}>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {portfolioData.projects.map((project, index) => (
        <div
          key={index}
          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform transform hover:-translate-y-2 hover:shadow-sky-500/20"
        >
          <div className="p-6 flex-grow">
            <h3 className="text-2xl font-semibold text-white mb-3">{project.title}</h3>
            <p className="text-gray-300 text-base mb-6 flex-grow" dangerouslySetInnerHTML={{ __html: project.description }} />
          </div>
          <div className="bg-gray-700 p-5 flex items-center justify-end space-x-4">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-sky-600 text-white text-sm font-semibold rounded-lg shadow transition-transform transform hover:scale-105 hover:bg-sky-500"
              >
                View Demo
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-gray-600 text-white text-sm font-semibold rounded-lg shadow transition-transform transform hover:scale-105 hover:bg-gray-500"
              >
                {project.demoUrl ? "View Repo" : "Explore Project"}
              </a>
            )}
            {!project.demoUrl && !project.repoUrl && (
              <span className="px-5 py-2 text-gray-400 text-sm font-semibold">
                Details
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </Section>
);

/**
 * Education Page
 * Displays education and certifications.
 */
const Education = () => (
  <Section title="Education & Certifications" icon={<GraduationCap />}>
    <div className="space-y-12">
      {/* Education */}
      <div>
        <h3 className="text-2xl font-semibold text-white mb-6">Education</h3>
        <div className="space-y-6">
          {portfolioData.education.map((edu, index) => (
            <div key={index} className="relative">
              <div className="absolute -left-[3.2rem] top-1 w-6 h-6 bg-sky-600 rounded-full border-4 border-gray-950"></div>
              <h4 className="text-xl font-medium text-white">{edu.institution}</h4>
              <p className="text-lg text-gray-300">{edu.degree}</p>
              <p className="text-sm text-gray-400">{edu.period}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Certifications */}
      <div>
        <h3 className="text-2xl font-semibold text-white mb-6">Certifications</h3>
        <div className="space-y-6">
          {portfolioData.certifications.map((cert, index) => (
            <div key={index} className="relative">
              <div className="absolute -left-[3.2rem] top-1 w-6 h-6 bg-sky-600 rounded-full border-4 border-gray-950"></div>
              <h4 className="text-xl font-medium text-white">{cert.name}</h4>
              <p className="text-lg text-gray-300">{cert.issuer}</p>
              <p className="text-sm text-gray-400">{cert.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Section>
);

/**
 * Contact Page
 * Displays contact form.
 */
const Contact = () => (
  <Section title="Get In Touch" icon={<Mail />}>
    <p className="text-lg text-gray-300 mb-8 max-w-2xl">
      I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. 
      Feel free to reach out.
    </p>
    
    <form
      action={`mailto:${portfolioData.contactEmail}`}
      method="POST"
      encType="text/plain"
      className="max-w-2xl space-y-6"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">Your Name</label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          placeholder="Muhammad Iqbal"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">Your Email</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          placeholder="example@email.com"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2">Message</label>
        <textarea
          name="message"
          id="message"
          rows="6"
          required
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          placeholder="Your message..."
        ></textarea>
      </div>
      
      <div>
        <button
          type="submit"
          className="px-8 py-3 bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-950"
        >
          Send Message
        </button>
      </div>
    </form>
  </Section>
);

// --- GEMINI AGENT CHAT MODAL ---

/**
 * AgentChatModal Component
 * Handles the AI agent chat interface and API calls.
 */
const AgentChatModal = ({ closeModal }) => {
  const [messages, setMessages] = useState([
    { role: 'agent', text: "Hello! I am Career-Twin, Muhammad Iqbal's professional AI agent. How can I help you today? Feel free to ask about his skills, projects, or experience." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Gemini API Call
  const askAgent = async (message) => {
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: message }]);

    const chatHistory = messages.map(msg => ({
      role: msg.role === 'agent' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));
    chatHistory.push({
        role: 'user',
        parts: [{ text: message }]
    });
    
    // Construct the payload
    const payload = {
        contents: chatHistory,
        systemInstruction: {
            parts: [{ text: AGENT_SYSTEM_PROMPT }]
        },
    };

    // FIX: Using the correct method to construct the API URL for the Canvas environment
    // Note: The API key is implicitly provided by the environment when the API key is an empty string
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();
      const agentText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (agentText) {
        setMessages(prev => [...prev, { role: 'agent', text: agentText }]);
      } else {
        throw new Error("Invalid response structure from API.");
      }

    } catch (error) {
      console.error("Gemini API call failed:", error);
      setMessages(prev => [...prev, { role: 'agent', text: "My apologies, I seem to be experiencing a connection issue. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      askAgent(input.trim());
      setInput('');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={closeModal}
    >
      <div
        className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden border border-gray-700"
        onClick={(e) => e.stopPropagation()} // Prevent modal close on content click
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-sky-800 text-white font-bold">
                <Cpu className="w-6 h-6" />
              </span>
            </span>
            <div>
              <p className="text-lg font-semibold text-white">Career-Twin</p>
              <p className="text-sm text-sky-400">Iqbal's AI Agent</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] p-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-sky-600 text-white rounded-br-none'
                    : 'bg-gray-800 text-gray-200 rounded-bl-none'
                }`}
              >
                <p className="text-base">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[75%] p-3 rounded-2xl bg-gray-800 text-gray-200 rounded-bl-none">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse animation-delay-200"></div>
                  <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse animation-delay-400"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about my projects, skills..."
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="p-3 bg-sky-600 text-white rounded-full transition-colors hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles.css';

function Projects() {
    const projects = [
        {
            id: 1,
            title: "Beirut (mobile frontend)",
            description: "React Native + Expo app for restaurant discovery in Lebanon. I built the mobile UI, navigation flow, auth, and data views, and wired it to the org's backend APIs.",
            technologies: ["react native", "expo", "typescript", "axios"],
            image: "/Images/beirut-mobile.png",
            codeLink: "https://github.com/BeirutSE/Beirut-Frontend"
        },
        {
            id: 2,
            title: "Beirut: LLM assistant backend",
            description: "Service that answers user queries about venues and menus using an LLM. Handles prompt building, retrieval, and response shaping for the mobile client.",
            technologies: ["node.js", "typescript", "openai", "express"],
            image: "/Images/beirut-llm.png",
            codeLink: "https://github.com/riwaht/beirut-chatbot-llm-proj"
        },
        {
            id: 3,
            title: "Notion ↔ Revolut server",
            description: "Sync + automation service that mirrors financial events into Notion and surfaces Notion data into workflows. Built the endpoints, webhooks, and schema mapping.",
            technologies: ["node.js", "express", "notion api", "revolut api", "webhooks"],
            image: "/Images/notion-revolut.png",
            codeLink: "https://github.com/riwaht/notion-revolut-server"
        },
        {
            id: 4,
            title: "Portfolio (3D + web)",
            description: "Your current 3D house experience plus the new multi-page site structure. Built with React/Three.js and a clean content layer for case studies.",
            technologies: ["react", "three.js", "r3f", "vite"],
            image: "/Images/MainScreen.png",
            codeLink: "https://github.com/riwaht/portfolio-2.0"
        },
        {
            id: 5,
            title: "RiwaBot (Discord bot)",
            description: "Discord4J bot in Java. Event-driven command handling, embeds, and modular features; built with Gradle and environment-based token management.",
            technologies: ["java", "discord4j", "gradle"],
            image: "/Images/discord-bot.png",
            codeLink: "https://github.com/riwaht/RiwaBot"
        },
        {
            id: 6,
            title: "Static Bloom (Game)",
            description: "Atmospheric horror game inspired by Little Nightmares. Custom Blender assets and Unity gameplay systems; lighting and environmental storytelling focused.",
            technologies: ["unity", "c#", "blender"],
            image: "/Images/static-bloom.jpg",
            codeLink: "https://github.com/riwaht/RiwasGame"
        },
        {
            id: 7,
            title: "TOPS algorithm visualizer",
            description: "Interactive visualization of the TOPS ATPG algorithm with step-by-step fault sensitization and D-frontier propagation.",
            technologies: ["react", "javascript", "d3.js"],
            image: "/Images/tops.gif",
            codeLink: "https://github.com/riwaht/tops-algorithm"
        }
    ];

    return (
        <div className="page-container">
            <Navbar />
            <div className="projects-content">
                <div className="professional-experience-compact">
                    <p>swe intern at snowflake • former simulation engineer at inmind.ai • coding instructor</p>
                    <div className="experience-links">
                        <a href="/PC Documents/Riwa Hoteit, CV.pdf" target="_blank" rel="noopener noreferrer">resume</a>
                        <span>•</span>
                        <a href="mailto:riwa.hoteit@lau.edu">contact</a>
                    </div>
                </div>
                
                <div className="projects-intro">
                    <blockquote className="projects-title">
                        things i've built
                    </blockquote>
                </div>
                
                <div className="projects-grid">
                    {projects.map((project) => (
                        <div key={project.id} className="project-card">
                            <div className="project-image">
                                <img src={project.image} alt={project.title} />
                            </div>
                            <div className="project-info">
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                                <div className="project-technologies">
                                    {project.technologies.map((tech, index) => (
                                        <span key={index} className="tech-tag">{tech}</span>
                                    ))}
                                </div>
                                <div className="project-links">
                                    {project.demoLink && (
                                        <a href={project.demoLink} className="project-link demo-link" target="_blank" rel="noopener noreferrer">
                                            live demo
                                        </a>
                                    )}
                                    <a href={project.codeLink} className="project-link code-link" target="_blank" rel="noopener noreferrer">
                                        view code
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default Projects;

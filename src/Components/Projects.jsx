import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles.css';

function Projects() {
    const projects = [
        {
            id: 1,
            title: "snowflake api expansion",
            description: "expanded rest and python api capabilities at snowflake, implementing preview feature gating, header-level role/warehouse support, and terraform compatibility.",
            technologies: ["python", "java", "snowflake", "openapi", "terraform"],
            image: "/public/Images/MainScreen.png",
            demoLink: "#",
            codeLink: "#"
        },
        {
            id: 2,
            title: "beirut restaurant platform",
            description: "full-stack mobile platform for lebanon restaurant discovery with node.js/mysql backend, gpt-3.5 integration, and automated notion cms sync.",
            technologies: ["react native", "node.js", "mysql", "gpt-3.5", "notion api"],
            image: "/public/Images/ImportantImage.png",
            demoLink: "#",
            codeLink: "#"
        },
        {
            id: 3,
            title: "tops algorithm visualizer",
            description: "interactive web application implementing the tops algorithm for atpg with real-time graph rendering, fault sensitization, and d-frontier propagation.",
            technologies: ["react", "javascript", "algorithm visualization", "d3.js"],
            image: "/public/Images/RandomImage.png",
            demoLink: "#",
            codeLink: "#"
        },
        {
            id: 4,
            title: "static bloom (side project)",
            description: "atmospheric horror game inspired by little nightmares, developed in unity during spare time. features custom blender assets and atmospheric gameplay.",
            technologies: ["unity", "c#", "blender", "personal project"],
            image: "/public/Images/MainScreen.png",
            demoLink: "#",
            codeLink: "#"
        }
    ];

    return (
        <div className="page-container">
            <Navbar />
            <div className="projects-content">
                <div className="projects-header">
                    <h1>things i've built</h1>
                    <p>from rest apis to developer platforms, mobile backends to infrastructure tooling - here's what i've been working on</p>
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
                                    <a href={project.demoLink} className="project-link demo-link">
                                        live demo
                                    </a>
                                    <a href={project.codeLink} className="project-link code-link">
                                        view code
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="projects-documents">
                    <h2>professional experience</h2>
                    <p>recent swe intern at snowflake (2025) • former simulation engineer at inmind.ai (2023-2025) • coding instructor at geek express</p>
                    <div className="document-links">
                        <a href="/public/PC Documents/Riwa Hoteit, CV.pdf" className="doc-link" target="_blank" rel="noopener noreferrer">
                            complete resume
                        </a>
                        <a href="https://linkedin.com/in/riwa-hoteit" className="doc-link" target="_blank" rel="noopener noreferrer">
                            linkedin profile
                        </a>
                        <a href="https://github.com/riwa-hoteit" className="doc-link" target="_blank" rel="noopener noreferrer">
                            github projects
                        </a>
                        <a href="mailto:riwa.hoteit@lau.edu" className="doc-link" target="_blank" rel="noopener noreferrer">
                            get in touch
                        </a>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default Projects;

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles.css';

function Blog() {
    const blogPosts = [
        {
            id: 1,
            title: "expanding api capabilities at snowflake",
            date: "aug 15, 2025",
            excerpt: "lessons from my internship: implementing feature gating, terraform compatibility, and python client codegen for developer platforms.",
            readTime: "7 min read"
        },
        {
            id: 2,
            title: "building scalable rest apis with python and java",
            date: "jul 22, 2025",
            excerpt: "architectural decisions and performance optimizations when developing backend services for enterprise-scale applications.",
            readTime: "6 min read"
        },
        {
            id: 3,
            title: "from simulation engineering to platform development",
            date: "jun 28, 2025",
            excerpt: "transitioning from unity-based simulations at inmind.ai to api infrastructure work - what i learned along the way.",
            readTime: "5 min read"
        },
        {
            id: 4,
            title: "developing beirut's restaurant discovery platform",
            date: "mar 12, 2025",
            excerpt: "building a full-stack mobile platform with react native, node.js backend, and gpt integration for personalized recommendations.",
            readTime: "8 min read"
        }
    ];

    return (
        <div className="page-container">
            <Navbar />
            <div className="blog-content">
                <div className="blog-header">
                    <h1>thoughts & insights</h1>
                    <p>reflections on api development, developer platforms, infrastructure, and the journey through computer engineering</p>
                </div>
                
                <div className="blog-posts">
                    {blogPosts.map((post) => (
                        <article key={post.id} className="blog-post-card">
                            <div className="post-meta">
                                <span className="post-date">{post.date}</span>
                                <span className="post-read-time">{post.readTime}</span>
                            </div>
                            <h2 className="post-title">{post.title}</h2>
                            <p className="post-excerpt">{post.excerpt}</p>
                            <a href="#" className="read-more">dive deeper →</a>
                        </article>
                    ))}
                </div>
                
                <div className="blog-cta">
                    <p>more posts coming soon... diving deep into api architecture, developer tooling, database optimization, and lessons from building scalable platforms.</p>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default Blog;

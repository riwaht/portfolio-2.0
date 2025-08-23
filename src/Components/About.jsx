import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles.css';

function About() {
    const scrollToAbout = () => {
        document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const heroBackground = document.getElementById('hero-background');
        const codeElements = heroBackground?.querySelectorAll('.bg-code');

        const handleMouseMove = (e) => {
            if (!heroBackground || !codeElements) return;
            
            const rect = heroBackground.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            codeElements.forEach((codeElement) => {
                const elementRect = codeElement.getBoundingClientRect();
                const elementCenterX = elementRect.left + elementRect.width / 2 - rect.left;
                const elementCenterY = elementRect.top + elementRect.height / 2 - rect.top;
                
                const distance = Math.sqrt(
                    Math.pow(mouseX - elementCenterX, 2) + Math.pow(mouseY - elementCenterY, 2)
                );
                
                // Reveal code within 200px radius of mouse
                const maxDistance = 200;
                if (distance < maxDistance) {
                    const normalizedDistance = distance / maxDistance; // 0 to 1
                    const opacity = 0.5 - (0.35 * normalizedDistance); // 0.5 to 0.15
                    codeElement.style.opacity = Math.max(opacity, 0.08);
                    // Debug: console.log('Hover effect active:', opacity);
                } else {
                    codeElement.style.opacity = 0.08; // base opacity
                }
            });
        };

        const handleMouseLeave = () => {
            if (!codeElements) return;
            codeElements.forEach((codeElement) => {
                codeElement.style.opacity = 0.08; // Reset to base opacity
            });
        };

        if (heroBackground) {
            heroBackground.addEventListener('mousemove', handleMouseMove);
            heroBackground.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            if (heroBackground) {
                heroBackground.removeEventListener('mousemove', handleMouseMove);
                heroBackground.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    return (
        <div className="page-container">
            <Navbar />
            
            {/* Full-screen landing hero */}
            <div className="landing-hero">
                <div className="hero-background" id="hero-background">
                    <div className="bg-code bg-code-1">
                        {`const developer = {
  name: 'Riwa',
  background: 'Lebanese-Canadian',
  skills: ['Python', 'Java', 'SQL', 'FastAPI', 'Node.js'],
  recentRole: 'SWE Intern at Snowflake',
  focus: 'Developer Platforms & API Infrastructure'
};`}
                    </div>
                    <div className="bg-code bg-code-2">
                        {`# Expanding REST API capabilities at Snowflake
from fastapi import FastAPI, Header
app = FastAPI()

@app.post("/api/v2/query/execute")
async def execute_query(warehouse: str = Header(None)):
    return await process_with_terraform_support()`}
                    </div>
                    <div className="bg-code bg-code-3">
                        {`// Database integration and optimization
const dbConfig = {
  host: 'snowflake.compute.amazonaws.com',
  warehouse: process.env.WAREHOUSE,
  role: process.env.ROLE,
  connectionPool: { max: 20, min: 5 }
};`}
                    </div>
                    <div className="bg-code bg-code-4">
                        {`// Node.js backend with MySQL integration
const express = require('express');
const mysql = require('mysql2/promise');

app.get('/api/restaurants', async (req, res) => {
  const results = await db.query('SELECT * FROM restaurants');
  res.json({ data: results, gpt_enabled: true });
});`}
                    </div>
                    <div className="bg-code bg-code-5">
                        {`# Python testing for API validation
import pytest
from snowflake.connector import connect

def test_resource_visibility():
    conn = connect(warehouse='DEV_WH', role='API_ROLE')
    result = conn.execute('SHOW TABLES').fetchall()
    assert len(result) > 0`}
                    </div>
                    <div className="bg-code bg-code-6">
                        {`// OpenAPI spec integration with Java backend
@RestController
@RequestMapping("/api/v1")
public class ResourceController {
  
  @GetMapping("/resources")
  public ResponseEntity<List<Resource>> getResources() {
    return ResponseEntity.ok(resourceService.findAll());
  }
}`}
                    </div>
                    <div className="bg-code bg-code-7">
                        {`-- Feature gating with SQL parameters
SELECT * FROM preview_features pf
JOIN openapi_specs os ON pf.feature_id = os.id
WHERE pf.enabled = true 
  AND os.terraform_compatible = true;`}
                    </div>
                    <div className="bg-code bg-code-8">
                        {`# Infrastructure as Code with Python
import terraform
import yaml

def deploy_api_infrastructure():
    config = yaml.load('api-config.yml')
    tf = terraform.Terraform(working_dir='./infra')
    tf.apply(var=config)`}
                    </div>
                    <div className="bg-code bg-code-9">
                        {`// Client codegen for developer tooling
const generatePythonClient = (openApiSpec) => {
  const endpoints = parseEndpoints(openApiSpec);
  return endpoints.map(endpoint => 
    generatePythonMethod(endpoint)
  ).join('\n');
};`}
                    </div>
                    <div className="bg-code bg-code-10">
                        {`# Performance monitoring for API endpoints
import time
from functools import wraps

def monitor_api_performance(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        logger.info(f"API call took {time.time() - start:.2f}s")
        return result
    return wrapper`}
                    </div>
                    <div className="bg-code bg-code-11">
                        {`// TOPS Algorithm Implementation (Academic Project)
function sensitizePath(faultLine) {
  const dFrontier = findDFrontier(faultLine);
  return propagateJustification(dFrontier);
}`}
                    </div>
                    <div className="bg-code bg-code-12">
                        {`// Side project: Horror game in Unity
public class AtmosphericController : MonoBehaviour {
  [Header("Personal Game Dev Project")]
  public float shadowIntensity = 0.8f;
  // Developing Static Bloom in spare time
}`}
                    </div>
                </div>
                <h1 className="hero-title">hi, i'm Riwa!</h1>
                <div className="scroll-indicator" onClick={scrollToAbout}>
                    <span>scroll to discover more</span>
                    <div className="scroll-arrow"></div>
                </div>
            </div>
            
            {/* About content section */}
            <div className="about-content" id="about-section">
                <div className="about-two-column">
                    <div className="about-photo">
                        <div className="photo-placeholder">
                            <span>photo coming soon</span>
                        </div>
                    </div>
                    
                    <div className="about-text">
                        <p>
                            i'm a lebanese-canadian computer engineering student passionate about developer platforms and api infrastructure. 
                            recently completed my software engineer internship at snowflake, previously worked as a simulation engineer at inmind.ai.
                        </p>
                        
                        <p>
                            i specialize in building rest apis, python backends, database integration, and developer tooling. 
                            on the side, i develop games in unity and explore 3d web technologies.
                        </p>
                        
                        <p>
                            president of google developer student club and founding president of ieee women in engineering at lau. 
                            passionate about connecting systems, optimizing performance, and creating seamless developer experiences.
                        </p>
                        
                        <div className="page-links">
                            <p>explore my work:</p>
                            <div className="link-grid">
                                <a href="/projects" className="simple-link">< projects /></a>
                                <a href="/blog" className="simple-link">< blog /></a>
                                <a href="/house" className="simple-link">< experience /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default About;

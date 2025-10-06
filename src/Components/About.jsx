import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles.css';

function About() {
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [animationPhase, setAnimationPhase] = useState('initial'); // 'initial', 'roles'
    const [visibleRoles, setVisibleRoles] = useState([]); // Array of currently visible roles
    
    const [showCursor, setShowCursor] = useState(true);
    const [animationCompleted, setAnimationCompleted] = useState(false); // Track if initial animation is done

    const scrollToAbout = () => {
        document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' });
    };

    const animateRolesOut = (callback) => {
        // Get all role items and apply slide-up-out animation with staggered delays
        const roleItems = document.querySelectorAll('.role-item');
        
        if (roleItems.length === 0) {
            callback();
            return;
        }

        roleItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('slide-up-out');
            }, index * 150); // 150ms delay between each role for smoother stagger
        });

        // Clear roles after all animations complete - add extra buffer time
        const totalAnimationTime = (roleItems.length - 1) * 150 + 800; // stagger delay + animation duration + buffer
        setTimeout(callback, totalAnimationTime);
    };

    const handleRiwaClick = (e) => {
        e.preventDefault();
        
        if (animationCompleted && animationPhase === 'roles') {
            // Restart the animation
            setAnimationCompleted(false);
            setVisibleRoles([]);
            
            setTimeout(() => {
                let currentIndex = 0;
                
                const addNextRoleRestart = () => {
                    if (currentIndex < roles.length && roles[currentIndex] !== undefined) {
                        const roleToAdd = roles[currentIndex];
                        
                        setVisibleRoles(prev => {
                            const newRoles = [...prev, roleToAdd];
                            return newRoles;
                        });
                        
                        currentIndex++;
                        
                        // Schedule next role if there are more
                        if (currentIndex < roles.length) {
                            setTimeout(addNextRoleRestart, 1000);
                        } else {
                            setTimeout(() => {
                                animateRolesOut(() => {
                                    setVisibleRoles([]);
                                    setAnimationCompleted(true);
                                });
                            }, 2000);
                        }
                    } else {
                        setTimeout(() => {
                            animateRolesOut(() => {
                                setVisibleRoles([]);
                                setAnimationCompleted(true);
                            });
                        }, 2000);
                    }
                };
                
                // Start the restart sequence
                addNextRoleRestart();
            }, 200); // Small delay for smooth restart
        }
    };

    // Animation sequences
    const initialSequence = [
        { text: "hi, i'm a software engin-", action: 'type', delay: 1200 },
        { text: "hi, i'm a ", action: 'backspace', delay: 600 },
        { text: "hi, i'm a game develop-", action: 'type', delay: 1200 },
        { text: "hi, i'm ", action: 'backspace', delay: 600 },
        { text: "hi, i'm Riwa.", action: 'type', delay: 1000 }
    ];

    const roles = [
        'a software engineer',
        'a game developer',
        'a creative thinker',
        'a tech enthusiast'
    ];

    const totalCycleLength = roles.length; // Just roles, no "Riwa" in cycle

    // Initial typewriter animation with corrections
    useEffect(() => {
        if (animationPhase !== 'initial') return;

        let sequenceIndex = 0;
        let currentText = '';
        
        const animate = () => {
            if (sequenceIndex >= initialSequence.length) {
                setAnimationPhase('roles');
                return;
            }

            const currentStep = initialSequence[sequenceIndex];
            
            if (currentStep.action === 'type') {
                // Typing animation
                let charIndex = currentText.length;
                const typeChar = () => {
                    if (charIndex < currentStep.text.length) {
                        currentText = currentStep.text.slice(0, charIndex + 1);
                        setDisplayText(currentText);
                        charIndex++;
                        setTimeout(typeChar, 60); // Faster typing
                    } else {
                        // Ensure we have the exact target text
                        currentText = currentStep.text;
                        setDisplayText(currentText);
                        // Finished typing this text, wait then move to next step
                        setTimeout(() => {
                            sequenceIndex++;
                            animate();
                        }, currentStep.delay);
                    }
                };
                typeChar();
                
            } else if (currentStep.action === 'backspace') {
                // Backspace animation - delete letter by letter
                const backspaceChar = () => {
                    if (currentText.length > currentStep.text.length) {
                        currentText = currentText.slice(0, -1);
                        setDisplayText(currentText);
                        setTimeout(backspaceChar, 40); // Slightly slower for visibility
                    } else {
                        // Ensure we set the exact target text
                        currentText = currentStep.text;
                        setDisplayText(currentText);
                        // Finished backspacing, wait then move to next step
                        setTimeout(() => {
                            sequenceIndex++;
                            animate();
                        }, currentStep.delay);
                    }
                };
                backspaceChar();
            }
        };

        const timer = setTimeout(animate, 800); // Start after 0.8 seconds
        return () => clearTimeout(timer);
    }, [animationPhase]);

    // Role cycling animation with bounce effect
    useEffect(() => {
        if (animationPhase !== 'roles') return;

        // Start building dropdown immediately after roles phase begins
        const startCycling = setTimeout(() => {
            // Hide cursor smoothly
            setShowCursor(false);
            
            // Ensure clean state before starting
            setVisibleRoles([]);
            
            // Start adding roles after cursor fades
            setTimeout(() => {
                let currentIndex = 0;
                
                const addNextRole = () => {
                    if (currentIndex < roles.length && roles[currentIndex] !== undefined) {
                        const roleToAdd = roles[currentIndex];
                        
                        setVisibleRoles(prev => {
                            const newRoles = [...prev, roleToAdd];
                            return newRoles;
                        });
                        
                        currentIndex++;
                        
                        // Schedule next role if there are more
                        if (currentIndex < roles.length) {
                            setTimeout(addNextRole, 1000);
                        } else {
                            setTimeout(() => {
                                animateRolesOut(() => {
                                    setVisibleRoles([]);
                                    setAnimationCompleted(true);
                                });
                            }, 2000);
                        }
                    } else {
                        setTimeout(() => {
                            animateRolesOut(() => {
                                setVisibleRoles([]);
                                setAnimationCompleted(true);
                            });
                        }, 2000);
                    }
                };
                
                // Start the sequence
                addNextRole();
            }, 300); // Smooth transition after cursor fades
            
        }, 500); // Start sooner for smoother transition

        return () => {
            clearTimeout(startCycling);
        };
    }, [animationPhase]);

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
  currentRole: 'SWE Intern at Snowflake (ongoing)',
  focus: 'Developer Platforms & API Infrastructure',
  loves: ['coding', 'traveling', 'discovering new cultures']
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
                        {`// Travel planning meets tech optimization
const nextDestination = {
  location: 'exploring...',
  apiIntegration: true,
  culturalImmersion: 'high',
  codingFromCafes: true,
  debugSessionsWithMountainViews: 'preferred'
};`}
                    </div>
                    <div className="bg-code bg-code-10">
                        {`# Building developer tools that work
@app.middleware('http')
async def add_cors_header(request: Request, call_next):
    response = await call_next(request)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response`}
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
                <h1 className="hero-title">
                    {animationPhase === 'initial' ? (
                        <>
                            {displayText.includes('Riwa.') ? (
                                <>
                                    hi, i'm <span className="riwa-name"> Riwa.</span>
                                </>
                            ) : (
                                displayText
                            )}
                            {showCursor && <span className="typing-cursor">|</span>}
                        </>
                    ) : (
                        <>
                            <div className="dropdown-container">
                                <div className="main-line">
                                    hi, i'm <span 
                                        className={`riwa-name ${animationCompleted ? 'clickable' : ''}`}
                                        onClick={handleRiwaClick}
                                    >
                                        Riwa.
                                    </span>
                                    {showCursor && <span className="typing-cursor">|</span>}
                                </div>
                                {visibleRoles.length > 0 && !animationCompleted && (
                                    <div className="roles-dropdown">
                                        {visibleRoles.filter(role => role && role.trim() !== '').map((role, index) => (
                                            <div 
                                                key={`${index}-${role}`} 
                                                className="role-item slide-in"
                                                style={{ animationDelay: `${index * 0.1}s` }}
                                            >
                                                {role}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </h1>
                <div className="scroll-indicator" onClick={scrollToAbout}>
                    <span>scroll to discover more</span>
                    <div className="scroll-arrow"></div>
                </div>
            </div>
            
            {/* About content section */}
            <div className="about-content" id="about-section">
                <div className="about-intro">
                    <div className="section-title">
                        about me
                    </div>
                </div>
                
                <div className="about-two-column">
                    <div className="about-photo">
                        <img 
                            src="/Images/riwa-photo.jpg" 
                            alt="Riwa Hoteit" 
                            className="profile-photo"
                        />
                    </div>
                    <div className="about-text">
                        <p>
                            hey! i'm a lebanese-canadian computer engineering student who loves building things that make developers' lives easier. 
                            currently doing my software engineering internship at snowflake working on api infrastructure, and previously worked as a simulation engineer at inmind.ai.
                        </p>
                        
                        <p>
                            i specialize in crafting rest apis, backends, and developer tooling that just works. 
                            when i'm not coding, you'll find me developing games in unity, testing random apis, traveling, boxing, or organizing my entire life in notion (yes, i'm that person who creates templates for everything!).
                        </p>
                        
                        <p>
                            at uni, i led google developer student club, founded ieee women in engineering, and was a notion campus leader. 
                            i'm passionate about connecting systems, creating seamless developer experiences, and inspiring others to dive into tech!
                        </p>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default About;

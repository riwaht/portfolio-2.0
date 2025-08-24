import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles.css';

function Blog() {
    const [selectedPost, setSelectedPost] = React.useState(null);

    // Handle ESC key to close modal
    React.useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && selectedPost) {
                setSelectedPost(null);
            }
        };

        if (selectedPost) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [selectedPost]);

    const blogPosts = [
        {
            id: 1,
            title: "Designing a Narrative Puzzle-Platformer: Building Worlds Through Silence and Motion",
            date: "June 2025",
            readTime: "5 min read",
            tags: ["Game Development", "Technical"],
            excerpt: "I've been working on a narrative-driven puzzle-platformer inspired by Inside, Limbo, and Fahrenheit 451. Instead of dialogue, the game tells its story through movement, puzzles, and environments. Here's a look at how I'm building a world where silence speaks louder than words.",
            content: `
                <h2>The Vision</h2>
                <p>The idea was simple: build a game where the story unfolds without a single line of dialogue. Inspired by titles like <em>Inside</em> and <em>Limbo</em>, and layered with the emotional weight of <em>Fahrenheit 451</em>, I wanted to create a platformer where silence, atmosphere, and the player’s imagination become the narrative engine.</p>
                
                <h2>The Protagonist</h2>
                <p>The player controls a figure draped in an oversized firefighter’s jacket. Their face is hidden, and their silence is absolute. Expression comes only through how they move, hesitant steps, sudden sprints, or the small pauses that suggest memory and fear. This design forces players to read meaning in body language rather than dialogue.</p>
                
                <h2>Worldbuilding Through Environments</h2>
                <p>Instead of cutscenes or text, the world itself does the storytelling. Each level represents a fragment of memory, torn between duty and guilt. Some of the key locations already in development are:</p>
                <ul>
                    <li><strong>A Burned Apartment:</strong> Ash and charred walls conceal fragments of family life, asking the player to piece together what was lost.</li>
                    <li><strong>Foggy City Streets:</strong> Endless concrete and shadows of onlookers, blurring the line between memory and reality.</li>
                    <li><strong>An Abandoned Firefighter Station:</strong> Empty lockers, broken alarms, and echoes of responsibility that was once shouldered.</li>
                </ul>
                
                <h2>Puzzles as Storytelling</h2>
                <p>Puzzles aren’t just mechanical obstacles; they represent memory, suppression, and truth. For example, players might need to reconstruct a broken hydrant system to clear smoke from a room, or re-light emergency lights to reveal hidden fragments of the past. Each challenge is meant to mirror the protagonist’s inner struggle.</p>
                
                <h2>The Technical Approach</h2>
                <p>The game is being built in Unity with heavy attention to animation and atmospheric design. Color palettes shift dynamically as the story progresses, brightening as truth surfaces, or darkening as denial takes hold. Audio plays a crucial role too: subtle breathing, echoes of alarms, and environmental hums create tension in the absence of dialogue.</p>
                
                <h2>Design Challenges</h2>
                <p>One of the hardest problems so far has been <strong>expressing emotion without dialogue or cutscenes</strong>. Movement animations need to feel human and fragile, while environments must tell a story without overwhelming the player. The balance between subtlety and clarity is delicate, but rewarding when it clicks.</p>
                
                <h2>Key Learnings</h2>
                <p><strong>1. Atmosphere is a Narrative Tool</strong><br/>
                Light, sound, and environment design aren’t set dressing, they are the story.</p>
                
                <p><strong>2. Silence is Powerful</strong><br/>
                Removing dialogue forces creativity. It makes every animation and puzzle design choice carry weight.</p>
                
                <p><strong>3. Player Interpretation Matters</strong><br/>
                By leaving space for ambiguity, players project their own emotions and interpretations into the world, creating a more personal connection.</p>
                
                <h2>What’s Next</h2>
                <p>The next phase of development focuses on polishing the core movement system, layering in more environmental puzzles, and experimenting with how color transitions tie into branching narrative choices. The ultimate goal is to create a game that feels less like playing through a script and more like wandering through someone’s fractured memory.</p>
                
                <p>This project has taught me that silence isn’t emptiness, it’s space. Space for players to breathe, wonder, and feel. And in that silence, the story speaks the loudest.</p>
            `
        },
        {
            id: 2,
            title: "Bridging Financial Data: How I Built a Notion-Bank Sync Tool",
            date: "August 2025",
            readTime: "6 min read",
            tags: ["Backend", "FastAPI", "Automation"],
            excerpt: "Ever wished your bank transactions could automatically sync to Notion? I built a small FastAPI backend that links TrueLayer and Notion to give me complete control over how my financial data is categorized and visualized.",
            content: `
              <h2>The Problem</h2>
              <p>As someone who tracks everything in Notion — from tasks to goals to even memories — managing my expenses separately through banking apps never felt complete. I wanted my financial transactions to show up in Notion automatically, categorized, converted, and ready to analyze.</p>
          
              <h2>The Solution</h2>
              <p>I built a FastAPI backend that connects to my bank via <a href="https://truelayer.com" target="_blank">TrueLayer</a> (I use Revolut) and syncs transactions to Notion. The system handles categorization, multi-currency conversion, and supports multiple bank accounts with ease.</p>
          
              <h2>Technical Architecture</h2>
              <p>The system is designed to be modular and flexible, with these main components:</p>
              <ul>
                <li><strong>TrueLayer Integration:</strong> Handles OAuth2, token refresh, and transaction fetching</li>
                <li><strong>Category Mapper:</strong> Uses keyword matching + Sentence Transformers for semantic classification</li>
                <li><strong>Currency Converter:</strong> Fetches and caches live USD exchange rates using <code>forex-python</code></li>
                <li><strong>Notion Sync:</strong> Creates or updates database entries for expenses and income</li>
              </ul>
          
              <h2>The Implementation</h2>
              <p>I wanted the codebase to remain small and focused, so I avoided unnecessary abstractions or frameworks. The main sync logic is just a few Python modules working together:</p>
              <pre><code class="language-python"># Example: Categorizing and syncing a transaction
          from revolut_server.src.revolut.notion_revolut_connector import sync_transactions
          
          @app.post("/sync")
          async def trigger_sync():
              results = sync_transactions()
              return {"status": "ok", "synced": results}</code></pre>
          
              <h2>Handling the Challenges</h2>
              <p><strong>1. Categorization with Semantics</strong><br/>
              Not every transaction has a clean merchant name or obvious keyword. To make categorization smarter, I used Sentence Transformers to compare descriptions semantically against each category's embeddings. It’s surprisingly good at figuring out what “Zakopane ski rental” means.</p>
          
              <p><strong>2. Multi-Currency Support</strong><br/>
              Since I'm living in Poland but earn in USD, accurate currency conversion was essential. Transactions are converted to USD using real-time rates, with fallback caching in case the API is down.</p>
          
              <p><strong>3. Portability</strong><br/>
              The system works across all connected bank accounts and doesn't require any Revolut-specific features. It can support any bank TrueLayer connects to, and the Notion field mappings are fully customizable.</p>
          
              <h2>Automation Workflows</h2>
              <ul>
                <li>Semantic + keyword-based expense categorization</li>
                <li>Multi-account support via TrueLayer</li>
                <li>Daily sync via cron or Make.com</li>
                <li>USD currency standardization</li>
                <li>Optional dual-database setup for income and expenses</li>
              </ul>
          
              <h2>The Result</h2>
              <p>Every day, my Notion workspace updates with the latest transactions — no more manual copying or guessing where my money went. It’s simple, fast, and tailored to my setup.</p>
          
              <h2>What I Learned</h2>
              <p>This project reminded me how powerful small automation tools can be. By combining a few APIs and keeping the system modular, I built something I actually use every day. I’m deliberately keeping the scope limited — no bloated dashboards or 3rd-party dependencies — but I’m always open to suggestions or improvements.</p>
          
              <p>It’s still a work in progress, but it’s already saved me hours of tracking and budgeting time. If you like automating personal finance or organizing everything in Notion like I do, feel free to check it out or reach out!</p>
            `
          },          
        {
            id: 3,
            title: "My First Coding Project: Talking to Myself Through a Discord Bot",
            date: "February 2021",
            readTime: "5 min read",
            tags: ["Backend", "Non-Technical"],
            excerpt: "Before APIs, internships, or even proper side projects, there was one chaotic Discord bot. It was my very first coding project, built with Discord4J, and it taught me more about reading documentation (and patience) than anything else.",
            content: `
                <h2>The Context</h2>
                <p>Back when I started, there was no ChatGPT I could ask for help. It was just me, a Java library called <strong>Discord4J</strong>, and about four short subpages of documentation with tiny examples. No walkthroughs, no deep explanations—just enough to say, “Good luck.”</p>
        
                <h2>Learning by Chaos</h2>
                <p>I had no clue what I was doing. So I did the only thing I could: <em>fuck around and find out</em>. I copy-pasted, broke things, fixed them, broke them again. Slowly, I started to understand how event-driven code worked.</p>
        
                <h2>The First Command</h2>
                <p>The goal was simple: make the bot say hello. It looked something like this:</p>
                <pre><code>
        // My very first command
        client.onMessageCreate(event -> {
            if (event.getMessage().getContent().equalsIgnoreCase("!hello")) {
                event.getMessage().getChannel().block()
                     .createMessage("Hello, world!");
            }
        });
                </code></pre>
                <p>It wasn’t much, but when that message appeared in the server, I felt unstoppable. I had just written code that <em>talked back to me</em>.</p>
        
                <h2>Why It Stuck</h2>
                <p>What made this project special wasn’t the code itself, but the feeling. For the first time, I realized that I could use programming to replace myself—to literally automate my presence in a Discord server and have a bot talk to my friends for me. That was hilarious, but also strangely powerful.</p>
        
                <h2>What It Taught Me</h2>
                <ul>
                    <li><strong>Documentation Is Your Friend:</strong> Even when it’s vague, learning to read between the lines of docs is a superpower.</li>
                    <li><strong>Experimentation > Perfection:</strong> Breaking stuff taught me faster than following any step-by-step tutorial.</li>
                    <li><strong>Coding Can Be Fun:</strong> That project is what made me fall in love with programming in the first place.</li>
                </ul>
        
                <h2>Looking Back</h2>
                <p>That Discord bot wasn’t impressive. It was clunky, barely useful, and honestly kind of spammy. But it was the first time I felt the spark—that <em>this</em> is what I want to keep doing. And honestly, that spark is still here today.</p>
        
                <p><em>If I could add a gif here, it would be the bot happily spamming “Hello world” in chat while my friends begged me to turn it off.</em></p>
            `
        }        
    ];

    return (
        <div className="page-container">
            <Navbar />
            <div className="blog-content">
                <div className="blog-intro">
                    <div className="section-title">
                        thoughts & insights
                    </div>
                </div>
                
                <div className="blog-posts">
                    {blogPosts
                        .sort((a, b) => {
                            // Parse dates for proper sorting
                            const parseDate = (dateStr) => {
                                const [month, year] = dateStr.split(' ');
                                return new Date(year, new Date(month + ' 1, 2000').getMonth());
                            };
                            return parseDate(b.date) - parseDate(a.date); // Most recent first
                        })
                        .map((post) => (
                        <article key={post.id} className="blog-post-card">
                            <div className="post-meta">
                                <span className="post-date">{post.date}</span>
                                <span className="post-read-time">{post.readTime}</span>
                            </div>
                            <h2 className="post-title">{post.title}</h2>
                            <p className="post-excerpt">{post.excerpt}</p>
                            {post.tags && (
                                <div className="post-tags">
                                    {post.tags.map((tag, index) => (
                                        <span key={index} className="post-tag">{tag}</span>
                                    ))}
                                </div>
                            )}
                            <button 
                                className="read-more" 
                                onClick={() => setSelectedPost(post)}
                            >
                                dive deeper →
                            </button>
                        </article>
                    ))}
                </div>
                
                <div className="blog-cta">
                    <p>more posts coming soon...</p>
                </div>
            </div>
            
            {/* Blog Post Modal - Notion-style center peek */}
            {selectedPost && (
                <div className="blog-modal-overlay" onClick={() => setSelectedPost(null)}>
                    <div className="blog-modal" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="blog-modal-close" 
                            onClick={() => setSelectedPost(null)}
                            aria-label="Close modal"
                        >
                            ✕
                        </button>
                        <div className="blog-modal-header">
                            <h1>{selectedPost.title}</h1>
                            <div className="blog-modal-meta">
                                <span>{selectedPost.date}</span>
                                <span>•</span>
                                <span>{selectedPost.readTime}</span>
                            </div>
                        </div>
                        <div 
                            className="blog-modal-content" 
                            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                        />
                    </div>
                </div>
            )}
            
            <Footer />
        </div>
    );
}

export default Blog;

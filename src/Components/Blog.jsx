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
            readTime: "9 min read",
            excerpt: "I’ve been working on a narrative-driven puzzle-platformer inspired by Inside, Limbo, and Fahrenheit 451. Instead of dialogue, the game tells its story through movement, puzzles, and environments. Here’s a look at how I’m building a world where silence speaks louder than words.",
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
            title: "Bridging Financial Data: How I Built a Notion-Revolut Integration",
            date: "August 2025",
            readTime: "6 min read",
            excerpt: "Ever wished your financial transactions could automatically sync to your Notion workspace? I built a server that bridges Revolut and Notion APIs, creating seamless financial tracking workflows.",
            content: `
                <h2>The Problem</h2>
                <p>As someone who organizes everything in Notion (yes, I'm that person who creates templates for everything!), I was frustrated by manually tracking my Revolut transactions. I wanted my financial data to automatically flow into my Notion budgeting system.</p>
                
                <h2>The Solution</h2>
                <p>I built a Node.js server that acts as a bridge between Revolut's API and Notion's database API. The system handles real-time transaction syncing and provides automation workflows.</p>
                
                <h2>Technical Architecture</h2>
                <p>The integration consists of three main components:</p>
                <ul>
                    <li><strong>Webhook Handler:</strong> Receives real-time transaction events from Revolut</li>
                    <li><strong>Data Transformer:</strong> Maps Revolut transaction data to Notion database schema</li>
                    <li><strong>Sync Engine:</strong> Handles API rate limits and ensures data consistency</li>
                </ul>
                
                <h2>The Implementation</h2>
                <p>Here's how the webhook handling works:</p>
                <pre><code>// Webhook endpoint for Revolut transactions
app.post('/webhook/revolut', async (req, res) => {
  const transaction = req.body;
  
  // Transform Revolut data to Notion format
  const notionPage = {
    parent: { database_id: process.env.NOTION_DB_ID },
    properties: {
      'Amount': { number: transaction.amount },
      'Merchant': { title: [{ text: { content: transaction.merchant } }] },
      'Date': { date: { start: transaction.created_at } },
      'Category': { select: { name: categorizeTransaction(transaction) } }
    }
  };
  
  // Create page in Notion
  await notion.pages.create(notionPage);
  res.sendStatus(200);
});</code></pre>
                
                <h2>Handling the Challenges</h2>
                <p><strong>1. API Rate Limits</strong><br/>
                Both Revolut and Notion have rate limits. I implemented a queue system with exponential backoff to handle bulk syncing gracefully.</p>
                
                <p><strong>2. Data Consistency</strong><br/>
                Financial data requires perfect accuracy. I added transaction ID tracking and reconciliation logic to prevent duplicates.</p>
                
                <p><strong>3. Schema Mapping</strong><br/>
                Revolut's rich transaction data needed to be mapped to Notion's property types. I created flexible schema mappers that could be configured per workspace.</p>
                
                <h2>Automation Workflows</h2>
                <p>Beyond basic syncing, I added smart categorization:</p>
                <ul>
                    <li>Automatic expense categorization based on merchant data</li>
                    <li>Monthly budget tracking with progress indicators</li>
                    <li>Recurring transaction detection and tagging</li>
                    <li>Multi-currency conversion and tracking</li>
                </ul>
                
                <h2>The Result</h2>
                <p>Now my Notion workspace automatically updates with every transaction. I can see spending patterns, track budgets, and generate reports without any manual data entry. The system processes hundreds of transactions monthly with 99.9% accuracy.</p>
                
                <h2>What I Learned</h2>
                <p>This project taught me the power of API integrations in creating seamless user experiences. Sometimes the best solutions come from connecting existing tools in new ways rather than building from scratch.</p>
                
                <p>It also reinforced my love for automation. There's something magical about systems that just work in the background, making your life easier without you even thinking about it.</p>
            `
        },
        {
            id: 3,
            title: "My First Coding Project: Talking to Myself Through a Discord Bot",
            date: "February 2021",
            readTime: "7 min read",
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

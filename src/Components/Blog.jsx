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
            title: "Building API Infrastructure at Snowflake: Lessons from a Summer Internship",
            date: "August 2025",
            readTime: "8 min read",
            excerpt: "This summer, I dove deep into expanding REST API capabilities at Snowflake, working on Terraform integration and developer platform improvements. Here's what I learned about building infrastructure that scales.",
            content: `
                <h2>The Challenge</h2>
                <p>When I joined Snowflake as a Software Engineering intern, I was tasked with expanding the REST API capabilities to better support Terraform integration. The goal was to improve developer experience and make our infrastructure more accessible to teams building on our platform.</p>
                
                <h2>What I Built</h2>
                <p>My main project involved enhancing the REST API infrastructure to support new Terraform resource types. This meant:</p>
                <ul>
                    <li><strong>API Endpoint Design:</strong> Creating new endpoints that follow RESTful principles while maintaining backward compatibility</li>
                    <li><strong>Database Integration:</strong> Optimizing queries for better performance with connection pooling and efficient data retrieval</li>
                    <li><strong>Testing Framework:</strong> Building comprehensive test suites using Python and pytest to validate API responses and resource visibility</li>
                </ul>
                
                <h2>The Technical Deep Dive</h2>
                <p>One of the most interesting challenges was implementing feature gating for preview functionality. We needed a system where new API features could be enabled selectively:</p>
                <pre><code>// Pseudocode for feature gating system
QUERY preview_features_table
JOIN WITH api_specifications 
WHERE feature.enabled = true
  AND feature.terraform_ready = true
RETURN enabled_features_list</code></pre>
                
                <p>The Python backend used FastAPI for rapid development and clear API documentation:</p>
                <pre><code>// Pseudocode for API endpoint structure
DEFINE FastAPI_application

ENDPOINT POST "/api/execute"
  HEADERS: warehouse_identifier
  FUNCTION execute_query():
    VALIDATE request_headers
    PROCESS query_with_terraform_integration()
    RETURN api_response</code></pre>
                
                <h2>Key Learnings</h2>
                <p><strong>1. Developer Experience is Everything</strong><br/>
                The best APIs are invisible to the user. Every design decision should remove friction, not add it.</p>
                
                <p><strong>2. Testing in Production Environments</strong><br/>
                Working with real production data taught me the importance of comprehensive testing and gradual rollouts.</p>
                
                <p><strong>3. Documentation as Code</strong><br/>
                Using OpenAPI specs that generate both documentation and client libraries ensured our API was always accurately documented.</p>
                
                <h2>Impact</h2>
                <p>By the end of the internship, the new API endpoints were processing thousands of requests daily, and the Terraform integration improved deployment times for infrastructure teams by 40%.</p>
                
                <p>This experience reinforced my passion for developer platforms and infrastructure. There's something deeply satisfying about building tools that make other developers' lives easier.</p>
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
                    {blogPosts.map((post) => (
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

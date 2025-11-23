import React, { useState, useEffect } from 'react';
import { BlueCard, BlueButton, IconBox, Avatar } from './components/UIComponents';
import { User, Post, ServerMetrics, Comment } from './types';
import { analyzeSystemHealth } from './services/geminiService';

// --- Mock Data ---
const CURRENT_USER: User = {
    id: 'system',
    name: 'System Monitor',
    avatar: 'https://ui-avatars.com/api/?name=System+Monitor&background=2563eb&color=fff&bold=true',
    role: 'Admin'
};

const INITIAL_POSTS: Post[] = [
    {
        id: 'p1',
        userId: 'system',
        userName: 'System Monitor',
        userAvatar: 'https://ui-avatars.com/api/?name=System+Monitor&background=2563eb&color=fff&bold=true',
        content: 'Bảo trì định kỳ hoàn tất. Kernel v5.14 đã được cập nhật thành công trên cụm máy chủ chính.',
        likes: 125,
        comments: [
             { id: 'c1', userId: 'user1', userName: 'DevUser_01', userAvatar: 'https://ui-avatars.com/api/?name=Dev+One&background=1e293b&color=94a3b8', content: 'Xác nhận latency giảm đáng kể.', timestamp: new Date() }
        ],
        timestamp: new Date(Date.now() - 3600000)
    },
    {
        id: 'p2',
        userId: 'system',
        userName: 'System Monitor',
        userAvatar: 'https://ui-avatars.com/api/?name=System+Monitor&background=2563eb&color=fff&bold=true',
        content: 'Phát hiện lưu lượng truy cập bất thường từ dải IP 192.168.x.x. Firewall đã tự động kích hoạt rule block.',
        likes: 42,
        comments: [],
        timestamp: new Date(Date.now() - 7200000)
    }
];

// --- Main Component ---
const App: React.FC = () => {
    // State
    const [metrics, setMetrics] = useState<ServerMetrics>({
        cpu: 45,
        memory: 60,
        latency: 24,
        activeUsers: 1205,
        status: 'Healthy'
    });
    const [aiAnalysis, setAiAnalysis] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
    const [newPostContent, setNewPostContent] = useState('');

    // Simulate Server Metrics
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => {
                const cpuChange = Math.floor(Math.random() * 10) - 5;
                const newCpu = Math.min(100, Math.max(0, prev.cpu + cpuChange));
                
                const memChange = Math.floor(Math.random() * 5) - 2;
                const newMem = Math.min(100, Math.max(0, prev.memory + memChange));

                let status: ServerMetrics['status'] = 'Healthy';
                if (newCpu > 80 || newMem > 90) status = 'Critical';
                else if (newCpu > 60 || newMem > 75) status = 'Warning';

                return {
                    cpu: newCpu,
                    memory: newMem,
                    latency: 20 + Math.floor(Math.random() * 50),
                    activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
                    status
                };
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // Handle AI Analysis
    const handleAiAnalysis = async () => {
        setIsAnalyzing(true);
        const report = await analyzeSystemHealth(metrics);
        setAiAnalysis(report);
        setIsAnalyzing(false);
    };

    // Social Actions
    const handleLike = (postId: string) => {
        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                return { 
                    ...p, 
                    likes: p.isLiked ? p.likes - 1 : p.likes + 1, 
                    isLiked: !p.isLiked 
                };
            }
            return p;
        }));
    };

    const handleCreatePost = () => {
        if (!newPostContent.trim()) return;
        const newPost: Post = {
            id: Date.now().toString(),
            userId: CURRENT_USER.id,
            userName: CURRENT_USER.name,
            userAvatar: CURRENT_USER.avatar,
            content: newPostContent,
            likes: 0,
            comments: [],
            timestamp: new Date(),
            isLiked: false
        };
        setPosts([newPost, ...posts]);
        setNewPostContent('');
    };

    const handleComment = (postId: string, content: string) => {
        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                const newComment: Comment = {
                    id: Date.now().toString(),
                    userId: CURRENT_USER.id,
                    userName: CURRENT_USER.name,
                    userAvatar: CURRENT_USER.avatar,
                    content: content,
                    timestamp: new Date()
                };
                return { ...p, comments: [...p.comments, newComment] };
            }
            return p;
        }));
    };

    // --- Sub-components (Render Helpers) ---

    const renderServerStatus = () => (
        <BlueCard className="mb-6 relative overflow-hidden group">
            {/* Background Glow Animation */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-colors duration-1000 ${metrics.status === 'Critical' ? 'bg-red-500/30' : ''}`}></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-2xl font-bold text-blue-100 flex items-center gap-3">
                    <i className="fa-solid fa-server"></i> Trạng Thái Server
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${
                    metrics.status === 'Healthy' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                    metrics.status === 'Warning' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                    'bg-red-500/20 text-red-400 border-red-500/50'
                }`}>
                    {metrics.status.toUpperCase()}
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                <IconBox icon="fa-microchip" label="CPU Usage" value={`${metrics.cpu}%`} color={metrics.cpu > 80 ? 'text-red-400' : 'text-blue-400'} />
                <IconBox icon="fa-memory" label="Memory" value={`${metrics.memory}%`} color={metrics.memory > 80 ? 'text-yellow-400' : 'text-blue-400'} />
                <IconBox icon="fa-network-wired" label="Latency" value={`${metrics.latency}ms`} />
                <IconBox icon="fa-users" label="Users" value={metrics.activeUsers} />
            </div>

            <div className="mt-6 pt-4 border-t border-blue-500/30 relative z-10">
                <div className="flex justify-between items-start">
                    <div className="flex-1 mr-4">
                        <h3 className="text-sm font-semibold text-blue-300 mb-1">AI System Diagnosis</h3>
                        <p className="text-blue-100 text-sm italic min-h-[40px]">
                            {aiAnalysis ? (
                                <span className="typing-effect">{aiAnalysis}</span>
                            ) : (
                                <span className="text-blue-500/50">Chờ phân tích...</span>
                            )}
                        </p>
                    </div>
                    <BlueButton onClick={handleAiAnalysis} disabled={isAnalyzing}>
                         {isAnalyzing ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-robot"></i>}
                         {isAnalyzing ? 'Scanning...' : 'AI Scan'}
                    </BlueButton>
                </div>
            </div>
        </BlueCard>
    );

    const renderFeed = () => (
        <div className="space-y-6">
            {/* Create Post */}
            <BlueCard>
                <div className="flex gap-4">
                    <Avatar src={CURRENT_USER.avatar} />
                    <div className="flex-1">
                        <textarea 
                            className="w-full bg-slate-800/50 border border-blue-500/30 rounded-lg p-3 text-blue-100 placeholder-blue-500/50 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none transition-all"
                            rows={3}
                            placeholder="Ghi nhận log hệ thống..."
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end mt-2">
                            <BlueButton onClick={handleCreatePost} className="text-sm">
                                <i className="fa-solid fa-paper-plane"></i> Gửi Log
                            </BlueButton>
                        </div>
                    </div>
                </div>
            </BlueCard>

            {/* Posts List */}
            {posts.map(post => (
                <PostItem 
                    key={post.id} 
                    post={post} 
                    onLike={() => handleLike(post.id)} 
                    onComment={(content) => handleComment(post.id, content)}
                />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a1025] to-black pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-lg border-b border-blue-500/30 shadow-lg shadow-blue-900/20">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.6)]">
                            <i className="fa-solid fa-bolt text-white text-xl"></i>
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-wide">Blue<span className="text-blue-400">Pulse</span> Monitor</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-blue-400 uppercase tracking-wider hidden sm:block">System Status</span>
                            <span className="text-[10px] text-green-400 font-mono hidden sm:block">LIVE MONITORING</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {renderServerStatus()}
                {renderFeed()}
            </main>
        </div>
    );
};

// --- Sub Component: Post Item ---
const PostItem: React.FC<{ post: Post; onLike: () => void; onComment: (content: string) => void }> = ({ post, onLike, onComment }) => {
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);

    const submitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onComment(commentText);
            setCommentText('');
            setShowComments(true);
        }
    };

    return (
        <BlueCard className="mb-4">
            <div className="flex items-start gap-4 mb-4">
                <Avatar src={post.userAvatar} />
                <div>
                    <h3 className="font-bold text-white">{post.userName}</h3>
                    <p className="text-xs text-blue-400">{post.timestamp.toLocaleTimeString()} - {post.timestamp.toLocaleDateString()}</p>
                </div>
            </div>
            
            <p className="text-blue-100 mb-4 leading-relaxed whitespace-pre-line">{post.content}</p>
            
            {post.image && (
                <div className="mb-4 rounded-lg overflow-hidden border border-blue-500/30">
                    <img src={post.image} alt="Post content" className="w-full h-auto" />
                </div>
            )}

            <div className="flex items-center gap-6 border-t border-blue-500/20 pt-3">
                <button 
                    onClick={onLike}
                    className={`flex items-center gap-2 transition-colors ${post.isLiked ? 'text-blue-400' : 'text-gray-400 hover:text-blue-400'}`}
                >
                    <i className={`${post.isLiked ? 'fa-solid' : 'fa-regular'} fa-thumbs-up`}></i>
                    <span>{post.likes} Ack</span>
                </button>
                <button 
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
                >
                    <i className="fa-regular fa-comment"></i>
                    <span>{post.comments.length} Log</span>
                </button>
            </div>

            {/* Comment Section */}
            {(showComments || post.comments.length > 0) && (
                <div className={`mt-4 space-y-3 ${!showComments ? 'hidden' : ''}`}>
                    {post.comments.map(comment => (
                        <div key={comment.id} className="flex gap-3 p-3 bg-slate-800/40 rounded-lg border border-blue-500/10">
                            <Avatar src={comment.userAvatar} size="sm" />
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm text-blue-200">{comment.userName}</span>
                                    <span className="text-[10px] text-gray-500">{comment.timestamp.toLocaleTimeString()}</span>
                                </div>
                                <p className="text-sm text-gray-300">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                    
                    <form onSubmit={submitComment} className="flex gap-2 mt-3">
                        <input 
                            type="text" 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Ghi chú..." 
                            className="flex-1 bg-slate-900/50 border border-blue-500/30 rounded-lg px-3 py-2 text-sm text-blue-100 focus:outline-none focus:border-blue-400"
                        />
                        <button type="submit" className="text-blue-400 hover:text-blue-300 px-2">
                            <i className="fa-solid fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            )}
        </BlueCard>
    );
};

export default App;
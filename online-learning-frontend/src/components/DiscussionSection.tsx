import { useEffect, useState, useRef } from "react";
import { getCoursePosts, createPost, createComment, getPostComments } from "../services/discussion.service";
import { HiOutlineChatBubbleLeftRight, HiOutlineUserCircle, HiChevronDown, HiChevronUp, HiOutlinePaperAirplane, HiOutlineChatBubbleLeft } from "react-icons/hi2";
import { io, Socket } from "socket.io-client";

interface Post {
    _id: string;
    title: string;
    content: string;
    user: { _id: string; name: string };
    createdAt: string;
    commentsCount?: number;
}

interface Comment {
    _id: string;
    content: string;
    user: { _id: string; name: string };
    createdAt: string;
}

export default function DiscussionSection({ courseId }: { courseId: string }) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostContent, setNewPostContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
    const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
    const [newComment, setNewComment] = useState("");
    const [commentingId, setCommentingId] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) setUser(JSON.parse(userData));

        const loadPosts = async () => {
            try {
                const data = await getCoursePosts(courseId);
                setPosts(data);
            } catch (err) {
                console.error("Failed to load posts", err);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();

        // Socket integration
        socketRef.current = io("http://localhost:5000");
        socketRef.current.emit("join_course", courseId);

        socketRef.current.on("new_post", (post: Post) => {
            setPosts(prev => [post, ...prev]);
        });

        socketRef.current.on("new_comment", (comment: any) => {
            setComments(prev => ({
                ...prev,
                [comment.post]: prev[comment.post] ? [...prev[comment.post], comment] : [comment]
            }));
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [courseId]);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostTitle || !newPostContent || !user) return;

        setSubmitting(true);
        try {
            await createPost(courseId, { title: newPostTitle, content: newPostContent });
            setNewPostTitle("");
            setNewPostContent("");
        } catch (err) {
            alert("Failed to create post");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleComments = async (postId: string) => {
        if (expandedPostId === postId) {
            setExpandedPostId(null);
            return;
        }

        setExpandedPostId(postId);
        if (!comments[postId]) {
            try {
                const data = await getPostComments(postId);
                setComments(prev => ({ ...prev, [postId]: data }));
            } catch (err) {
                console.error("Failed to load comments", err);
            }
        }
    };

    const handleCreateComment = async (postId: string) => {
        if (!newComment || !user) return;
        setCommentingId(postId);
        try {
            await createComment(postId, newComment);
            setNewComment("");
        } catch (err) {
            alert("Failed to post comment");
        } finally {
            setCommentingId(null);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-400">Loading discussions...</div>;

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
            {/* NEW POST FORM */}
            <div className="p-6 bg-white border-b shrink-0 shadow-sm">
                <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                    <HiOutlineChatBubbleLeftRight size={20} className="text-teal-500" />
                    Start a Discussion
                </h3>
                {user ? (
                    <form onSubmit={handleCreatePost} className="space-y-3">
                        <input
                            type="text"
                            placeholder="Discussion Title"
                            className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all shadow-sm"
                            value={newPostTitle}
                            onChange={(e) => setNewPostTitle(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="What's on your mind?"
                            className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all min-h-[80px] shadow-sm"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            required
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-teal-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-teal-700 transition shadow-md disabled:opacity-50"
                            >
                                {submitting ? "Posting..." : "Create Post"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="bg-gray-50 border p-4 rounded-xl text-center text-sm text-gray-500 italic">
                        Please login to join the discussion.
                    </div>
                )}
            </div>

            {/* POSTS LIST */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {posts.length === 0 ? (
                    <div className="text-center p-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <HiOutlineChatBubbleLeft size={48} className="mx-auto text-gray-200 mb-4" />
                        <h4 className="font-bold text-gray-400">No discussions yet</h4>
                        <p className="text-xs text-gray-400 mt-1">Be the first to start a conversation!</p>
                    </div>
                ) : posts.map(post => (
                    <div key={post._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-indigo-50 p-2 rounded-full">
                                    <HiOutlineUserCircle className="text-indigo-400" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{post.user?.name || "Anonymous"}</p>
                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <h4 className="font-black text-gray-900 mb-2 leading-tight">{post.title}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">{post.content}</p>

                            <button
                                onClick={() => toggleComments(post._id)}
                                className="flex items-center gap-2 text-indigo-600 text-xs font-black uppercase tracking-widest hover:text-indigo-800 transition"
                            >
                                <HiOutlineChatBubbleLeftRight size={16} />
                                {expandedPostId === post._id ? "Hide Comments" : "Show Comments"}
                                {expandedPostId === post._id ? <HiChevronUp /> : <HiChevronDown />}
                            </button>
                        </div>

                        {/* COMMENTS SECTION */}
                        {expandedPostId === post._id && (
                            <div className="bg-gray-50 border-t p-6 space-y-4">
                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {comments[post._id]?.length === 0 ? (
                                        <p className="text-xs text-center text-gray-400 italic">No comments yet</p>
                                    ) : comments[post._id]?.map(comment => (
                                        <div key={comment._id} className="flex gap-3">
                                            <div className="shrink-0">
                                                <HiOutlineUserCircle className="text-gray-300" size={32} />
                                            </div>
                                            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 flex-1 shadow-sm">
                                                <div className="flex justify-between items-center mb-1">
                                                    <p className="text-xs font-bold text-indigo-900">{comment.user?.name || "Anonymous"}</p>
                                                    <p className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                                <p className="text-xs text-gray-700 leading-relaxed">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {user && (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Write a comment..."
                                            className="flex-1 text-xs p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleCreateComment(post._id)}
                                        />
                                        <button
                                            onClick={() => handleCreateComment(post._id)}
                                            disabled={commentingId === post._id || !newComment}
                                            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition shadow-md disabled:opacity-50"
                                        >
                                            <HiOutlinePaperAirplane className="rotate-90" size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

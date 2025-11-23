export interface User {
    id: string;
    name: string;
    avatar: string;
    role: 'Admin' | 'Dev' | 'Bot';
}

export interface Comment {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    timestamp: Date;
}

export interface Post {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    image?: string;
    likes: number;
    comments: Comment[];
    timestamp: Date;
    isLiked?: boolean; // Local state for current user
}

export interface ServerMetrics {
    cpu: number;
    memory: number;
    latency: number;
    activeUsers: number;
    status: 'Healthy' | 'Warning' | 'Critical';
}
export interface Discussion {
  id: string;
  _id?: string;
  title: string;
  content: string;
  author?: {
    _id?: string;
    id?: string;
    name?: string;
    avatar?: string;
  };
  category?: string;
  tags?: string[];
  createdAt: string;
  likes: number;
  replies: number;
  replyItems?: Reply[];
  isLiked?: boolean;
}

export interface Reply {
  _id?: string;
  content: string;
  createdAt: string;
  author?: {
    _id?: string;
    id?: string;
    name?: string;
    avatar?: string;
  };
}

export interface StudyGroup {
  id: string;
  _id?: string;
  name: string;
  description: string;
  subject: string;
  maxMembers: number;
  members: any[];
  memberCount?: number;
  createdAt: string;
  isMember?: boolean;
  rules?: string[];
  tags?: string[];
  creator?: {
    _id?: string;
    id?: string;
    name?: string;
    avatar?: string;
    email?: string;
  };
  isActive?: boolean;
  activityLevel?: string;
  lastActivity?: string;
  availableSpots?: number;
}

export interface GroupMessage {
  _id: string;
  group: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  attachments?: Array<{
    url: string;
    type: string;
    name: string;
  }>;
  createdAt: string;
}

export interface GroupPost {
  id: string;
  _id?: string;
  group: string;
  author?: {
    _id?: string;
    id?: string;
    name?: string;
    avatar?: string;
  };
  title: string;
  content: string;
  tags?: string[];
  likes: number;
  replies: number;
  replyItems?: Reply[];
  isLiked?: boolean;
  isPinned?: boolean;
  createdAt: string;
}

export interface Achievement {
  id: string;
  _id?: string;
  name: string;
  description: string;
  points: number;
  earned?: boolean;
  earnedAt?: string | null;
  icon?: string;
  rarity?: string;
  criteria?: string;
  category?: string;
}

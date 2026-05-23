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

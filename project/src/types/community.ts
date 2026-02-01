export interface Discussion {
  id: string;
  title: string;
  content: string;
  authorIdId: {
    name: string;
  };
  createdAt: string;
  likes: number;
  replies: number;
  isLiked?: boolean;
  category?: string;
  tags?: string[];
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subjectId: string;
  maxMembers: number;
  members: any[];
  createdAt: string;
  isMember?: boolean;
  rules?: string[];
  tags?: string[];
}

export interface Achievement {
  id: string;
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

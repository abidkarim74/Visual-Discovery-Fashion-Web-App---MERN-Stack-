import type { Profile } from "./ProfileType"


export interface Message {
  id: string,
  sender: Profile,
  receiver: Profile,
  text: string,
  createdAt: Date
}

export interface Conversation {
  id: string,
  participants: [Profile],
  messages: [Message],
  createdAt: Date
}

export interface MessageContextType {
  message: Message | null,
  setMessage: (value: Message | null) => void
  unreadCount: number,
  setUnreadCount: (value: number) => void
}


export interface Comment {
  _id?: string;
  user: {
    _id: string;
    username: string;
    profilePic: string | null;
  };
  text: string;
  createdAt: number;
}

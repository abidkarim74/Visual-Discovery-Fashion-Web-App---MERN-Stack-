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
  setMessage: (value:Message | null) => void
}
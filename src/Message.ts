export interface ChatMessage {
  type: "chat";
  message: string;
}

export interface LoginOutMessage {
  type: "login" | "logout";
  name: string;
}

export interface OnlineMessage {
  type: "online";
  users: string[];
}

export type Message = ChatMessage | LoginOutMessage | OnlineMessage;
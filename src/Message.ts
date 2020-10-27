import { Character } from "./Character";

export type Message = ChatMessage | LoginOutMessage | OnlineMessage | CharacterMessage;

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

export interface CharacterMessage {
  type: "character";
  character: Character
}
export interface Message {
  [x: string]: string;
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

export interface Channel {
  id: string;
  name: string;
}

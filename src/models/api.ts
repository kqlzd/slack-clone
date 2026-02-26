export interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles: {
    username: string | null;
  } | null;
}

export interface Channel {
  id: string;
  name: string;
}

export interface IProfile {
  id: string;
  username: string | null;
}

export interface User {
  id: string;
  username: string | null;
}

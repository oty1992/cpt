export interface IHttpClient {
  fetch<Data>(url: string, options: RequestInit): Promise<Data>;
}

export interface IAuthApi {
  getList(): Promise<Omit<UserInfo, 'password'>[]>;
  signup(user: SignUpInfo): Promise<AuthToken>;
  login(loginInfo: LoginInfo): Promise<AuthToken>;
  logout(): Promise<void>;
  me(): Promise<AuthToken>;
}

export type UserInfo = {
  id: string;
  email: string;
  username: string;
  password: string;
};

export type SignUpInfo = Omit<UserInfo, 'id'>;

export type LoginInfo = Pick<UserInfo, 'username' | 'password'>;

export type AuthToken = {
  token: string;
  username: string;
  userId: string;
};

export interface IRoomApi {
  translate: boolean;
  getList(): Promise<RoomInfo[]>;
  getRoom(roomId: string): Promise<RoomInfo | null>;
  create(room: RoomCreateInfo): Promise<RoomInfo>;
  update(roomId: string, updated: RoomCreateInfo): Promise<RoomInfo>;
  remove(roomId: string): Promise<string>;
  sendChat(roomId: string, message: string): Promise<ChatInfo>;
  toggleTranslate(): boolean;
}

export type Sentiment = 'positive' | 'negative' | 'neutral';

export type ChatInfo = {
  roomId: string;
  userId: string;
  username: string;
  message: string;
  sentiment: Sentiment;
  created_at: string;
};

export type RoomInfo = {
  id: string;
  title: string;
  users: Omit<UserInfo, 'password'>[];
  chats: ChatInfo[];
};

export type RoomCreateInfo = Omit<RoomInfo, 'id' | 'chats'>;

export type Validation<Type> = { [name in keyof Type]: boolean };

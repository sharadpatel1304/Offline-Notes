export type User = {
  username: string;
  pin: string; 
};

export type Note = {
  id: string;
  title: string;
  body: string;
  imageUri?: string; 
  createdAt: number;
  updatedAt: number;
};

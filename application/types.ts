import { Connection } from "mongoose"

declare global {
   var mongoose: {
      conn: Connection | null
      promise: Promise<Connection> | null
   }
}

export { }
export interface PostType {
   id: number;
   user: string;
   avatar: string;
   caption: string;
   images: string[];
   time: string;
   likes: number;
   comments: number;
}
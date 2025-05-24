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


export interface UserTypeContext {
   id: string;
   email?: string;
   fullName?: string;
   bio?: string;
   username?: string;
   role?: string;
   location?: string;
   profilePictureUrl?: string;
   profilePictureId?: string;
   postsCount?: number;
   isPrivateProfile?: boolean;
   resolvedPostsCount?: number;
   commentsCount?: number;
   notificationsCount?: number;
};

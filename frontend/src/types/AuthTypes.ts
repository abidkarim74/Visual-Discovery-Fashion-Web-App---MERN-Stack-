export interface User {
  id: string,
  username: string,
  firstname: string,
  lastname: string,
  profilePic: string,
  email: string,
  followers: User[],
  followings: User[],
  bio: string | null
}


export interface AuthContextType {
  accessToken: string | null,
  loading: boolean,
  setLoading: (val:boolean) => void,
  setAccessToken: (val: string | null) => void,
  user: User | null,
  setUser: (val: User| null) => void,  
}
import {UserProfile} from "./userProfile";

export interface AuthToken {
  id: number
  userProfileId: number
  userProfile: UserProfile
  value: string
  timeLogged: string
}

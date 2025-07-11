import { Photo } from "./photo"

export interface Member  {
  id: number
  username:string
  age:number
  photoUrl:string
  knownAs:string
  created: Date
  lastActive: Date
  gender: string
  introduction:string
  interests:string
  lookingFor:string
  city:string
    country: string
      displayName: string

  dateOfBirth: string
  imageUrl?: string

  description?: string

photos:Photo[]

}

export class MemberParams {
  gender?: string;
  minAge = 18;
  maxAge = 100;
  pageNumber = 1;
  pageSize = 4;
  orderBy = 'lastActive';
}


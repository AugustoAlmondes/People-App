export interface UserLocation {
  city: string;
  state: string;
  country: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
}

export interface UserName {
  title: string;
  first: string;
  last: string;
}

export interface UserPicture {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface User {
  login: {
    uuid: string;
    username: string;
  };
  name: UserName;
  email: string;
  phone: string;
  cell: string;
  location: UserLocation;
  picture: UserPicture;
  nat: string;
  gender: string;
}

export interface APIResponse {
  results: User[];
  info: {
    seed: string;
    results: number;
    page: number;
    version: string;
  };
}

export interface UserFilters {
  gender?: 'male' | 'female' | 'todos';
  nat?: string;
  order?: 'asc' | 'desc';
}

import { User } from './types';

export const MOCK_USERS: User[] = [
  {
    login: { uuid: '1', username: 'johndoe' },
    name: { title: 'Mr', first: 'John', last: 'Doe' },
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    cell: '098-765-4321',
    location: {
      city: 'New York',
      state: 'NY',
      country: 'United States',
      coordinates: { latitude: '40.7128', longitude: '-74.0060' }
    },
    picture: {
      large: 'https://randomuser.me/api/portraits/men/1.jpg',
      medium: 'https://randomuser.me/api/portraits/med/men/1.jpg',
      thumbnail: 'https://randomuser.me/api/portraits/thumb/men/1.jpg'
    },
    nat: 'US',
    gender: 'male'
  },
  {
    login: { uuid: '2', username: 'janedoe' },
    name: { title: 'Ms', first: 'Jane', last: 'Doe' },
    email: 'jane.doe@example.com',
    phone: '123-456-7891',
    cell: '098-765-4322',
    location: {
      city: 'London',
      state: 'England',
      country: 'United Kingdom',
      coordinates: { latitude: '51.5074', longitude: '-0.1278' }
    },
    picture: {
      large: 'https://randomuser.me/api/portraits/women/2.jpg',
      medium: 'https://randomuser.me/api/portraits/med/women/2.jpg',
      thumbnail: 'https://randomuser.me/api/portraits/thumb/women/2.jpg'
    },
    nat: 'GB',
    gender: 'female'
  },
  {
    login: { uuid: '3', username: 'carlos' },
    name: { title: 'Mr', first: 'Carlos', last: 'Silva' },
    email: 'carlos.silva@example.com',
    phone: '123-456-7892',
    cell: '098-765-4323',
    location: {
      city: 'São Paulo',
      state: 'SP',
      country: 'Brazil',
      coordinates: { latitude: '-23.5505', longitude: '-46.6333' }
    },
    picture: {
      large: 'https://randomuser.me/api/portraits/men/3.jpg',
      medium: 'https://randomuser.me/api/portraits/med/men/3.jpg',
      thumbnail: 'https://randomuser.me/api/portraits/thumb/men/3.jpg'
    },
    nat: 'BR',
    gender: 'male'
  },
  {
    login: { uuid: '4', username: 'marie' },
    name: { title: 'Ms', first: 'Marie', last: 'Dubois' },
    email: 'marie.dubois@example.com',
    phone: '123-456-7893',
    cell: '098-765-4324',
    location: {
      city: 'Paris',
      state: 'Île-de-France',
      country: 'France',
      coordinates: { latitude: '48.8566', longitude: '2.3522' }
    },
    picture: {
      large: 'https://randomuser.me/api/portraits/women/4.jpg',
      medium: 'https://randomuser.me/api/portraits/med/women/4.jpg',
      thumbnail: 'https://randomuser.me/api/portraits/thumb/women/4.jpg'
    },
    nat: 'FR',
    gender: 'female'
  },
  {
    login: { uuid: '5', username: 'klaus' },
    name: { title: 'Mr', first: 'Klaus', last: 'Müller' },
    email: 'klaus.muller@example.com',
    phone: '123-456-7894',
    cell: '098-765-4325',
    location: {
      city: 'Berlin',
      state: 'Berlin',
      country: 'Germany',
      coordinates: { latitude: '52.5200', longitude: '13.4050' }
    },
    picture: {
      large: 'https://randomuser.me/api/portraits/men/5.jpg',
      medium: 'https://randomuser.me/api/portraits/med/men/5.jpg',
      thumbnail: 'https://randomuser.me/api/portraits/thumb/men/5.jpg'
    },
    nat: 'DE',
    gender: 'male'
  }
];

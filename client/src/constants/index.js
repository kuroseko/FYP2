import { createCampaign, dashboard, logout, payment, profile, withdraw } from '../assets';

export const navlinks = [
  {
    name: 'Home',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'Campaigns',
    imgUrl: createCampaign,
    link: '/campaign',
  },
  {
    name: 'About',
    imgUrl: withdraw,
    link: '/about',
  },
  {
    name: 'Profile',
    imgUrl: profile,
    link: '/profile',
  },

];
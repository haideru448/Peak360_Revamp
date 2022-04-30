// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
/*  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill')
  }, */
  {
    title: 'Interactive',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill')
  },
 /* {
    title: 'Archive',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill')
  }, */
  {
    title: 'Settings',
    path: '/dashboard/blog',
    icon: getIcon('eva:file-text-fill')
  }
];

export default sidebarConfig;

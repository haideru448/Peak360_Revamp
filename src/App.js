// routes
import moment from 'moment-timezone';
import Router from './routes';
import DashboardLayout from './layouts/dashboard';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';



// ----------------------------------------------------------------------

export default function App() {

  return (
    <ThemeConfig>
      
      <ScrollToTop />
      <GlobalStyles />
      <BaseOptionChartStyle />
      <Router />
    </ThemeConfig>
  );
}

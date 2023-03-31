import Settings from '@/locale/en-US/common/settings';
import MessageBox from '@/components/message-box/locale/en-US';

// Message
import SuccessMessage from '@/locale/en-US/message/success';
import FailedMessage from '@/locale/en-US/message/failed';

// Base Components
import Menu from '@/locale/en-US/menu';
import SearchTableAction from '@/locale/en-US/common/searchTableAction';

// Views
import Login from '@/locale/en-US/login';
import Workplace from '@/locale/en-US/workplace';
import Hashrate from '@/locale/en-US/hashrate';
import Agent from '@/locale/en-US/agent';
import System from '@/locale/en-US/systemsetting';

export default {
  // Examples are shown above, and real business is shown below
  ...Menu,
  ...Settings,
  ...MessageBox,
  ...SuccessMessage,
  ...FailedMessage,
  ...SearchTableAction,
  ...Login,
  ...Workplace,
  ...Hashrate,
  ...Agent,
  ...System,
};

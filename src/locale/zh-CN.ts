import Settings from '@/locale/zh-CN/common/settings';
import MessageBox from '@/components/message-box/locale/zh-CN';

// Message
import SuccessMessage from '@/locale/zh-CN/message/success';
import FailedMessage from '@/locale/zh-CN/message/failed';

// Base Components
import Menu from '@/locale/zh-CN/menu';
import SearchTableAction from '@/locale/zh-CN/common/searchTableAction';

// Views

export default {
  // Examples are shown above, and real business is shown below
  ...Menu,
  ...Settings,
  ...MessageBox,
  ...SuccessMessage,
  ...FailedMessage,
  ...SearchTableAction,
};

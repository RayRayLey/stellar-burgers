import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { getUserSelector } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const name = useSelector(getUserSelector)?.name;
  return <AppHeaderUI userName={name || ''} />;
};

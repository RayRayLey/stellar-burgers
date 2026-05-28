import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getFeedsSelector, getFeeds } from '../..//services/slices/feedsSlice';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(getFeedsSelector);
  const dispatch = useDispatch();
  const loadFeeds = useCallback(() => dispatch(getFeeds()), [dispatch]);

  useEffect(() => {
    loadFeeds();
  }, []);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={loadFeeds} />;
};

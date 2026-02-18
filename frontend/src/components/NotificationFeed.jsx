import React, { useEffect, useMemo} from 'react';
import { useShowNotifications, useMarkNotificationsAsRead } from '../tanstack/queries/notificationQueries';
import NotificationCard from './NotificationCard'; // Import the card
import { Header } from '../components/Header';

const NotificationFeed = () => {  
  const { mutate: markAsRead } = useMarkNotificationsAsRead();
  const { data, isLoading, isError,  error  } = useShowNotifications();
  // const [hasViewed, setHasViewed] = useState(false);


  const notifications = useMemo(() => {
    return data?.notifications || [];
  }, [data?.notifications]);

 // Only start timer after user has been on page for 30 seconds
 useEffect(() => {
  console.log('Starting 30 second timer...');
  
  const timer = setTimeout(() => {
    console.log('30 seconds passed, marking as read');
    markAsRead();
  }, 10000);
  
  return () => {
    console.log('Cleanup, clearing timer');
    clearTimeout(timer);
  };
}, [markAsRead]);



  return (
    <main className="min-h-screen">
      {/* Header */}

      <Header/>
      <div className="sticky top-0 z-50 border-b border-gray-800 bg-black/80 backdrop-blur-md">
      </div>

      {/* Content States */}
      {isLoading && (
        <div className="p-8 text-center text-gray-500">
          <p>Loading notifications...</p>
        </div>
      )}

      {isError && (
        <div className="p-8 text-center text-red-500">
          <p>Error loading notifications</p>
          <p className="mt-2 text-sm text-gray-500">{error?.message}</p>
        </div>
      )}

      {!isLoading && !isError && notifications.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <p className="text-lg">No notifications yet</p>
          <p className="mt-2 text-sm">When you get notifications, they'll show up here.</p>
        </div>
      )}

      {!isLoading && !isError && notifications.length > 0 && (
        <div className="divide-y divide-gray-800">
          {notifications.map((n) => (
            <NotificationCard
              key={n._id}
              notification={n}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default NotificationFeed;


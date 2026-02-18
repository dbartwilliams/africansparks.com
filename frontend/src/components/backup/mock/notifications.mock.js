export const MOCK_NOTIFICATIONS = [
    {
      type: 'like',
      actor: {
        _id: 'u1',
        userName: 'James',
        userAvatar: 'user_avatar2.png',
      },
      spark: {
        _id: 's1',
        content: 'This is a spark I authored about React patterns.',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
    },
  
    {
      type: 'comment',
      actor: {
        _id: 'u2',
        userName: 'Pitusqui',
        userAvatar: 'user_avatar2.png',
      },
      spark: {
        _id: 's2',
        content: 'State management gets tricky at scale.',
      },
      content: 'history lesson. Charles Harbison revealed that, at Meghan’s request, the look was inspired by Zelda Wynn Valdez, a designer whose name, I’m just learning, deserves to be spoken alongside Dior and Balenciaga 🔥',
      createdAt: new Date(Date.now() - 1000 * 60 * 20),
    },
  
    {
      type: 'respark',
      actor: {
        _id: 'u3',
        userName: 'Janet',
        userAvatar: 'user_avatar2.png',
      },
      spark: {
        _id: 's3',
        content: 'Zustand vs Redux is mostly about mental models.',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
    },
  
    {
      type: 'connect',  // ✅ Fixed: removed leading space
      actor: {
        _id: 'u4',
        userName: 'Oanh Danielle',
        userAvatar: 'user_avatar2.png',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 120),
    },
  ];
  

//utils/imagePaths.js
export const getAvatarPath = (filename) => {
  return `sparkAvatar/${filename || 'user_avatar2.png'}`;
};

export const getSparkImagePath = (filename) => {
  return `spark/${filename}`;
};

export const getSparkCoverImagePath = (filename) => {
  return `sparkCover/${filename}`;
};

export const getSiteImagePath = (filename) => {
  return `site/${filename || 'default-blog.png'}`;
};



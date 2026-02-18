// utils/imageKit.js
import ImageKit from 'imagekit';
import 'dotenv/config';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "public_T9HLpG9UR5TVruVGlgY0mmnBhd0=",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "private_pmpiEAlVKiMf+iCUs4Yv/1BLB38=",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/vkcmnwrk6",
});

export default imagekit;

export const uploadToImageKit = async (buffer, originalName, folder = '/spark') => {
  const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');

  return new Promise((resolve, reject) => {
    imagekit.upload(
      { file: buffer, fileName: safeName, folder: folder },
      (err, result) => {
        if (err) return reject(err);
        resolve({ fileName: result.name });
      }
    );
  });
};

// export const uploadToImageKit = async (buffer, originalName) => {
//   const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');

//   return new Promise((resolve, reject) => {
//     imagekit.upload(
//       { file: buffer, fileName: safeName, folder: '/spark' },
//       (err, result) => {
//         if (err) return reject(err);
//         resolve({ fileName: result.name });
//       }
//     );
//   });
// };

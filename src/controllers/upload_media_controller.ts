import { Request, Response } from 'express';
import cloudinary from "../configs/upload_media_configs";

// export const uploadMedia = async (req: Request, res: Response) => {
//   try {
//     const files = req.files as Express.Multer.File[];
//     console.log("req.files", req.files);
//     console.log("req.headers", req.headers["content-type"]);
//     if (!files || files.length === 0) {
//       return res.status(400).json({ status: 'error', message: 'Image is required' });
//     }

//     const result = await Promise.all(
//       files.map(async (file, index) => {
//         const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
//         const uploaded = await cloudinary.uploader.upload(base64, {
//           folder: 'posts',
//         });
//         return {
//           FM600: Math.floor(Math.random() * 900000) + 100000,
//           index: index + 1,
//           IMG: uploaded.secure_url,
//           RATIO: uploaded.height > 0 ? uploaded.height / uploaded.width : 1,
//           THUMB: uploaded.secure_url.replace('/upload/', '/upload/w_720/'),
//           DES: "",
//         };
//       })
//     );

//     res.status(200).json({ status: 'success', elements: result });
//   } catch (error) {
//     res.status(500).json({ status: 'error', message: 'Upload image failed', error });
//   }
// }

export const uploadMedia = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        const folder = req.body.folder || 'posts';
        if (!files || files.length === 0) {
            return res.status(400).json({ status: 'error', message: 'File is required' });
        }

        const result = await Promise.all(
            files.map(async (file, index) => {
                const isVideo = file.mimetype.startsWith('video/');
                const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

                const uploaded = await cloudinary.uploader.upload(base64, {
                    folder,
                    resource_type: isVideo ? 'video' : 'image',
                });

                console.log('height', uploaded.height, 'width', uploaded.width);

                if (isVideo) {
                    return {
                        FM600: Math.floor(Math.random() * 900000) + 100000,
                        RATIO: uploaded.width > 0 ? uploaded.width / uploaded.height : 1,
                        index: index + 1,
                        SRC: uploaded.secure_url,
                        THUMB: uploaded.secure_url.replace('/upload/', '/upload/w_720/so_0/').replace(/\.[^.]+$/, '.jpg'), DES: "",
                        type: 'video',
                    };
                }

                return {
                    FM600: Math.floor(Math.random() * 900000) + 100000,
                    index: index + 1,
                    IMG: uploaded.secure_url,
                    RATIO: uploaded.height > 0 ? uploaded.height / uploaded.width : 1,
                    THUMB: uploaded.secure_url.replace('/upload/', '/upload/w_720/'),
                    DES: "",
                    type: 'image',
                };
            })
        );

        res.status(200).json({ status: 'success', elements: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'Upload media failed', error });
    }
};
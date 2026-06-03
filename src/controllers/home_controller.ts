import { Request, Response } from 'express';
import cloudinary from '../configs/upload_media_configs';
import { CommentModel } from '../models/comment_model';
import { HomeModel } from '../models/home_model';
import { LikeModel } from '../models/like_model';


export const getList = async (req: Request, res: Response) => {
  try {
    const posts = await HomeModel.find();
    res.json({
      status: 'success',
      timesv: new Date().toISOString(),
      elements: posts,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      timesv: new Date().toISOString(),
      message: 'Internal server error',
    });
  }
};

export const getList2 = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const FO100 = Number(req.query.FO100) || 0;

    


    const items = await HomeModel.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const itemsWithComments = await Promise.all(
      items.map(async (item) => {
        const totalComments = await CommentModel.countDocuments({ PP300: item.PP300 });
        const liked = FO100 ? await LikeModel.findOne({ PP300: item.PP300, FO100 }) : null;
        return {
          ...item.toObject(),
          TOTALCOMMENTS: totalComments,
          ISLIKED: liked ? 1 : 0,
        };
      })
    );
    const total = await HomeModel.countDocuments();

    res.json({
      status: 'success',
      timesv: new Date().toISOString(),
      total,
      limit,
      offset,
      elements: itemsWithComments,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      timesv: new Date().toISOString(),
      message: 'Internal server error',
    });
  }
};


export const createPost = async (req: Request, res: Response) => {
  try {
    const { PV301, PV305, PL348, PO322, FO100, NV106, NV126 } = req.body;

    const imageList = PO322?.image || [];
    const videoList = PO322?.video || [];

    if (!PV301) {
      return res.status(400).json({ status: 'error', message: 'PV301 (tiêu đề) là bắt buộc' });
    }
    if (!PV305) {
      return res.status(400).json({ status: 'error', message: 'PV305 (nội dung) là bắt buộc' });
    }

    console.log("Received data:", { PV301, PV305, PL348, imageList, videoList, FO100, NV106, NV126 });

    const newPost = new HomeModel({
      PV301,
      PV305,
      PL348: PL348 || new Date(),
      PP300: Math.floor(Math.random() * 900000) + 100000,
      PV325: Math.random().toString(36).substring(2, 10),
      PO322: { image: imageList, video: videoList, audio: [] },
      FO100: FO100 || 0,
      FO100H: 0,
      FT300: 0,
      PN303: 0,
      PN309: 0,
      PN326: 0,
      PN350: 0,
      TOTALLIKES: 0,
      TOTALCOMMENTS: 0,
      ISLIKED: 0,
      FNC951: 0,
      RN331: 0,
      PV302: "",
      PV307: imageList[0]?.IMG || videoList[0]?.THUMB || "",
      PV314: "",
      PV319: "",
      NV106: NV106 || "",
      NV126: NV126 || "",
      NV117: "",
      KV102: "",
      TYPE: "",
      PD308: new Date(),
    });

    const savedPost = await newPost.save();

    res.status(200).json({
      status: 'success',
      timesv: new Date().toISOString(),
      elements: savedPost,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      timesv: new Date().toISOString(),
      message: 'Internal server error',
      error: err
    });
  }
}

// export const uploadImg = async (req: Request, res: Response) => {
//   try {
//     const { image } = req.body;
//     if (!image) {
//       return res.status(400).json({ status: 'error', message: 'Image is required' });
//     }


//     const result = await Promise.all(
//       image.map(async (base64: string, index: number) => {
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
//     res.status(200).json({
//       status: 'success',
//       elements: result,
//     });
//   } catch (error) {

//     res.status(500).json({
//       status: 'error',
//       message: 'Upload image failed',
//       error: error
//     });
//   }

// }

export const uploadImg = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    console.log("req.files", req.files);
    console.log("req.headers", req.headers["content-type"]);
    if (!files || files.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Image is required' });
    }

    const result = await Promise.all(
      files.map(async (file, index) => {
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const uploaded = await cloudinary.uploader.upload(base64, {
          folder: 'posts',
        });
        return {
          FM600: Math.floor(Math.random() * 900000) + 100000,
          index: index + 1,
          IMG: uploaded.secure_url,
          RATIO: uploaded.height > 0 ? uploaded.height / uploaded.width : 1,
          THUMB: uploaded.secure_url.replace('/upload/', '/upload/w_720/'),
          DES: "",
        };
      })
    );

    res.status(200).json({ status: 'success', elements: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Upload image failed', error });
  }
}


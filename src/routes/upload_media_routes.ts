import { Router } from 'express';
import { upload } from '../configs/upload_media_configs';
import { uploadMedia } from '../controllers/upload_media_controller';

const routerUploadMedia = Router();

routerUploadMedia.post('/uploadMedia', upload.array('media'), uploadMedia);

export default routerUploadMedia;

// "video": [
//               {
//                 "index": 1,
//                 "thumb": "https://cdn.piepme.com/25723/videos/piep-ktc0eoBq17802805542401780280554240/thumb.jpg",
//                 "FM600": 266492,
//                 "title": "446b734c-d24c-464f-871d-dd1c66163e84_l0_001_1776492639-1780280550059.mp4",
//                 "src": "https://cdn.piepme.com/25723/videos/piep-ktc0eoBq17802805542401780280554240/hls/index.m3u8",
//                 "ratio": 1.7777777777777777,
//                 "duration": "",
//                 "description": ""
//               }
//             ],
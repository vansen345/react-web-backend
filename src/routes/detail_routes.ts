
import { getDetail } from "../controllers/detail_controller";
import router from "./home_routes";

router.post('/getDetail', getDetail); 

export default router;
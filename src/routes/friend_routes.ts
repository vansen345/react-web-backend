import { Router } from "express";
import { acceptFriendRequest, cancelFriendRequest, rejectFriendRequest, sendFriendRequest, unfriend } from "../controllers/friend_controller";

const friendRoute = Router();

friendRoute.post("/send", sendFriendRequest);
friendRoute.post("/accept", acceptFriendRequest);
friendRoute.post("/cancleRequets", cancelFriendRequest);
friendRoute.post("/rejectFriend", rejectFriendRequest);
friendRoute.post("/unfriend", unfriend);

export default friendRoute;
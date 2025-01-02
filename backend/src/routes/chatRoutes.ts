import { Router } from "express";
import { chatService } from "../services/chat/chat";
import { chatRepository } from "../repositories/chat/chat";
import { chatController } from "../controllers/chat/chat";
import { verifyDocToken, verifyToken } from "../config/jwtConfig";


const route = Router()

const chatRepositoryInstance = new chatRepository()
const chatServiceInstance = new chatService(chatRepositoryInstance)
const chatControllerInstance = new chatController(chatServiceInstance)


route.get('/fetchTwoMembersChat',verifyToken,verifyDocToken, chatControllerInstance.getChat.bind(chatControllerInstance));
route.post('/end-call', chatControllerInstance.updateAppointment.bind(chatControllerInstance));

export default route;



 
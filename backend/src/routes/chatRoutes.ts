import { Router } from "express";
import { chatService } from "../services/chatServices";
import { chatRepository } from "../repositories/chatRepository";
import { chatController } from "../controllers/chatController";




const route = Router()

const chatRepositoryInstance = new chatRepository()
const chatServiceInstance = new chatService(chatRepositoryInstance)
const chatControllerInstance = new chatController(chatServiceInstance)


route.get('/fetchTwoMembersChat', chatControllerInstance.getChat.bind(chatControllerInstance));

export default route;



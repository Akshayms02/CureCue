

import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setRoomId, setShowVideoCall, setVideoCall } from '../../Redux/Slice/doctorSlice'
import { RootState } from '../../Redux/store'
import { useSocket } from '../../Context/SocketIO'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { PhoneOff, Mic, Video, } from "lucide-react"
import axiosUrl from '../../Utils/axios'

export default function VideoChatDoctor() {
    const { socket } = useSocket()
    const videoCallRef = useRef(null)
    const { roomIdDoctor, videoCall } = useSelector((state: RootState) => state.doctor)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    console.log(videoCall)

    useEffect(() => {
        const appId = parseInt(import.meta.env.VITE_APP_ID)
        const serverSecret = import.meta.env.VITE_ZEGO_SECRET
        const roomIdStr = roomIdDoctor?.toString()
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, serverSecret, roomIdStr, Date.now().toString(), "Doctor")
        const zp = ZegoUIKitPrebuilt.create(kitToken)

        zp.joinRoom({
            container: videoCallRef.current,
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            turnOnMicrophoneWhenJoining: true,
            turnOnCameraWhenJoining: true,
            showPreJoinView: false,
            onLeaveRoom: () => {
                console.log("about toooooo end the call")
                socket?.emit('leave-room', ({ to: videoCall.userID }))
                dispatch(setShowVideoCall(false))
                dispatch(setRoomId(null))
                axiosUrl.post('/api/chat/end-call', {
                    appointmentId: videoCall?.appointmentId,

                }).catch(error => {
                    console.error("Error ending the call:", error);
                });
                console.log("call ended")
                dispatch(setVideoCall(null))
            },
        })

        socket?.on('user-left', () => {
            zp.destroy()
            dispatch(setShowVideoCall(false))
            dispatch(setRoomId(null))
            dispatch(setVideoCall(null))
            localStorage.removeItem('roomId')
            localStorage.removeItem('showVideoCall')
        })

        return () => {
            zp.destroy()
        }
    }, [roomIdDoctor, socket, videoCall, dispatch])

    return (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <CardContent className="relative w-full h-full p-0" ref={videoCallRef}>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    <Button variant="destructive" size="icon" onClick={() => socket?.emit('leave-room', ({ to: videoCall.userID }))}>
                        <PhoneOff className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="icon">
                        <Mic className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="icon">
                        <Video className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
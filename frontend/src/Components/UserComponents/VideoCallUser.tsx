'use client'

import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setVideoCall } from '../../Redux/Slice/doctorSlice'
import { RootState } from '../../Redux/store'
import { useSocket } from '../../Context/SocketIO'
import { setRoomId, setShowIncomingVideoCall, setShowVideoCall } from '../../Redux/Slice/userSlice'

import { Card, CardContent } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { PhoneOff, Mic, Video } from "lucide-react"
import { endCall } from '../../services/userServices'

export function getUrlParams(url = window.location.href) {
    const urlStr = url.split('?')[1]
    return new URLSearchParams(urlStr)
}

function VideoChatUser() {
    const { socket } = useSocket()
    const videoCallRef = useRef(null)
    const { showIncomingVideoCall, roomIdUser, videoCall } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()

    console.log(videoCall)

    console.log("show", showIncomingVideoCall)

    useEffect(() => {
        const appId = parseInt(import.meta.env.VITE_APP_ID)
        const serverSecret = import.meta.env.VITE_ZEGO_SECRET


        const roomIdStr = roomIdUser.toString()
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, serverSecret, roomIdStr, Date.now().toString(), "user")
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
                console.log("ended the call dddddddddddddd")
                socket?.emit('leave-room', ({ to: showIncomingVideoCall._id }))

                dispatch(setShowVideoCall(false))
                dispatch(setRoomId(null))

                dispatch(setShowIncomingVideoCall(null))
                console.log("about to make api call")
                const appointmentId = videoCall?.appointmentId
                endCall(appointmentId).catch(error => {
                    console.error("Error ending the call:", error);
                });
                dispatch(setVideoCall(null))
            },

        })

        socket?.on('user-left', () => {
            // Leave the Zego room and navigate to the previous route
            zp.destroy()
            // navigate(-1);
            dispatch(setShowVideoCall(false))
            dispatch(setRoomId(null))
            dispatch(setVideoCall(null))
            dispatch(setShowIncomingVideoCall(null))
            localStorage.removeItem('roomId')
            localStorage.removeItem('showVideoCall')
        })

        // Cleanup when the component unmounts
        return () => {
            zp.destroy() // Use destroy method to clean up the instance
        }
    }, [roomIdUser])

    const handleEndCall = () => {
        socket?.emit('leave-room', ({ to: showIncomingVideoCall._id }))
        dispatch(setShowVideoCall(false))
        dispatch(setRoomId(null))
        dispatch(setVideoCall(null))
        dispatch(setShowIncomingVideoCall(null))
    }

    return (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black">
            <CardContent className="relative w-full h-full p-0" ref={videoCallRef}>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    <Button variant="destructive" size="icon" onClick={handleEndCall}>
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

export default VideoChatUser


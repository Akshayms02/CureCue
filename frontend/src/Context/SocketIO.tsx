import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { io, Socket } from 'socket.io-client';
import { RootState } from '../Redux/store';
import { setShowIncomingVideoCall, endCallUser } from '../Redux/Slice/userSlice';
import { endCallDoctor, setRoomId, setShowVideoCall } from "../Redux/Slice/doctorSlice"




const SocketContext = createContext<any>({ socket: null });


export const useSocket = () => {
    return useContext(SocketContext);
};



export const SocketProvider: React.FC<any> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const userInRedux = useSelector((state: RootState) => state.user)
    const doctorInRedux = useSelector((state: RootState) => state.doctor)
    const loggedUser = userInRedux.userInfo != null ? userInRedux?.userInfo?.userId : doctorInRedux?.doctorInfo?.doctorId
    console.log("doctorId: ", doctorInRedux.doctorInfo?.doctorId);
    console.log("userId: ", userInRedux);
    console.log("loggedUser: ", loggedUser);

    const dispatch: any = useDispatch()



    useEffect(() => {

        if (loggedUser) {
            console.log("wwww", loggedUser);

            const newSocket = io("http://localhost:5000", {
                query: {
                    userId: loggedUser
                }
            });

            newSocket.on("connect", () => {
                console.log("Socket connected", socket);
                setSocket(newSocket);
            })



            return () => {

                newSocket.disconnect();
            };
        } else {
            setSocket(null)
        }
    }, [loggedUser]);

    useEffect(() => {
        socket?.on('incoming-video-call', (data) => {
            console.log('Client connected', data)
            dispatch(setShowIncomingVideoCall({ ...data.from, callType: data.callType, roomId: data.roomId }))
            // dispatch(setStartVideoCall({ ...data.from, callType: data.callType, roomId: data.roomId }))
        })

        socket?.on('accept-call', (data) => {

            dispatch(setRoomId(data.roomId))
            dispatch(setShowVideoCall(true))
        })

        socket?.on('call-rejected', () => {
            dispatch(endCallDoctor())
            dispatch(endCallUser())
        })
        return () => {
            socket?.off('incoming-video-call')
        }
    }, [socket])

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

import {io} from "socket.io-client";export const createSocket=()=>io((process.env.NEXT_PUBLIC_SOCKET_URL||"http://localhost:5000").replace(/\/$/,""),{withCredentials:true,autoConnect:true});

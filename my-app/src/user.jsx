import React, { useEffect, useState } from 'react';
import Form from './Form';
import SelfGame from './selfGame';

const User = ({socket}) => {
    const [IsLoggined, SetIsLoggined] = useState(false)
    useEffect(()=>{
        socket.on('joinRoomSuccess',(data)=>{
            if(data.res){
                SetIsLoggined(true)
            }
        })
    }, [socket])
    return (
        <div style={{widows:"100%", height:"100%", display:"flex", justifyContent:"center",alignItems:"center"}}>
            {IsLoggined ? (
                    <SelfGame socket={socket}></SelfGame>
                ):(

                    <Form socket={socket}></Form>
            )}
        </div>
    );
};

export default User;
import React, { useEffect } from 'react';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter, Routes, and Route
    import io from 'socket.io-client';
    import Form from './Form';
    import Host from './host';
    import User from './user';
    
    
    const socket = io.connect('http://192.168.1.20:5005');
    
    const MyComponent = () => {
    
        return (
            <Router> 
                <Routes> 
                    <Route path="/" element={<User socket= {socket} />} />
                    <Route path='/host' element={<Host socket= {socket}></Host>}></Route>
                </Routes>
            </Router>
        );
    };
    
    export default MyComponent;
    
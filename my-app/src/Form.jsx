import React, { useEffect, useState } from 'react';
import styles from './styles/form.module.css';

const Form = ({ socket }) => {
    const [name, setName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [error, setError] = useState('');

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleRoomCodeChange = (event) => {
        setRoomCode(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        socket.emit("reqToJoinToTheRoom", { room: roomCode, name: name });
    };

    useEffect(() => {
        socket.on("joinRoomFailure", (data) => {
            setError(`Комнаты с кодом ${data.room} не существует`);
        });

        return () => {
            socket.off("joinRoomFailure");
        };
    }, [socket]);

    return (
        <div className={styles.formcontainer}>
            <form style={{ display: "flex", flexDirection: "column", backgroundColor: "black", color: "white", height: "100%" }} onSubmit={handleSubmit}>
                <strong style={{ fontSize: "20pt", margin: "15px" }}>Подключение к комнате</strong>
                <div className="form-group" style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ fontSize: "20", margin: "0 10px", width: "calc(100% - 20px)", textAlign: "start" }} htmlFor="roomCode">Код комнаты:</label>
                    <input
                        type="text"
                        id="roomCode"
                        value={roomCode}
                        onChange={handleRoomCodeChange}
                        className={styles.inpt}
                    />
                </div>
                <div className="form-group" style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ fontSize: "20", margin: "0 10px", width: "calc(100% - 20px)", textAlign: "start" }} htmlFor="name">Имя:</label>
                    <input
                        className={styles.inpt}
                        type="text"
                        id="name"
                        value={name}
                        onChange={handleNameChange}
                    />
                </div>
                <button className={styles.btn} type="submit">Подключиться</button>
                <strong style={{ color: "red" }}>{error}</strong>
            </form>
        </div>
    );
};

export default Form;

import React, { useEffect, useState } from 'react';
import styles from "./styles/form.module.css";


const SelfGame = ({socket}) => {
    const [word, setWord] = useState('');
    const [error, setError] = useState('');
    const handleNameChange = (event) => {
        // Update the state with the new value from the input field
        setWord(event.target.value);
    };
   useEffect(()=>{
    socket.on("SuggestWordFail",(data)=>{
        setError(data.mess)
    })
   },[socket])
    const handleSubmit = (event) => {
        event.preventDefault();
        socket.emit("SuggestTheWord", word.toLocaleLowerCase().trim())
        setWord('');
    };

    return (
        <div style={{ backgroundColor: "black", color: "white", width: "100%", height: "calc(100% - 60px)", padding:"30px", }}>
            
            <form style={{ display: "flex", flexDirection: "column", backgroundColor: "black", color: "white", height: "100%" }} onSubmit={handleSubmit}>
            <div className="form-group" style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "20", margin: "0 10px", width: "calc(100% - 20px)", textAlign: "start" }} htmlFor="name">Введите предполагаемое слово</label>
                <input
                    className={styles.inpt}
                    type="text"
                    id="name"
                    value={word}
                    onChange={handleNameChange}
                />
                <button className={styles.btn} onClick={handleSubmit} type="submit">Отправить</button>
                <strong style={{marginTop:"5px", color: "red" }}>{error}</strong>
                </div>
            </form>
            
        </div>
    );
};

export default SelfGame;

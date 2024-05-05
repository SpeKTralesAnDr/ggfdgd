import React, { useEffect, useState } from 'react';
import styles from './styles/host.module.css';
import ReactWordcloud from 'react-wordcloud';
import Chat from './Chat';
import LeaderBoard from './LeaderBoard';

const Host = ({ socket }) => {
    const [wordsArePrepared, setWordsPrepared] = useState(false);
    const [text, setText] = useState('');
    const [words, setWords] = useState([]);

    const [code, setCode] = useState('');
    const [wordsArray, setWordsArray] = useState([]);

    const initialWords = [
        
    ];
    const [wordsCloud, setWordsCloud] = useState(initialWords);
    const handleChange = (event) => {
        setText(event.target.value); 
    };
    
    const [Messages, setMessages] = 
    useState([
 
     ])
     useEffect(() => {
      
        socket.on("Message", (data) => {
            console.log(data.message);
            setMessages(prevMessages => [...prevMessages, data]);
        });
    
        socket.on("NewSuggestedWord", (data) => {
           
            setWords(prevWords => {
            
                const updatedWords = [...prevWords];
        
                const existingIndex = updatedWords.findIndex(item => item.name === data.name);
        
                if (existingIndex !== -1) {

                    if (!updatedWords[existingIndex].words.includes(data.word)) {
                        updatedWords[existingIndex].words.push(data.word);
                    }
                } else {
                   
                    const newWordObject = { name: data.name, words: [data.word] };
                    updatedWords.push(newWordObject);
                }
        
                return updatedWords;
            });
        });
        
        
    
        socket.on("GetRoomCode", (data) => {
            console.log('test');
            setCode(data);
        });
    
       
        return () => {
            socket.off("Message");
            socket.off("NewSuggestedWord");
            socket.off("GetRoomCode");
        };
    }, []); 
    
   
    useEffect(() => {

        const wordsMap = {};
    
    
        words.forEach(item => {

            item.words.forEach(word => {
                if (wordsMap[word]) {
                   
                    wordsMap[word]++;
                } else {
                  
                    wordsMap[word] = 1;
                }
            });
        });
    
       
        const newWordsCloud = Object.entries(wordsMap).map(([word, count]) => ({
            text: word,
            value: count
        }));
    
        
        setWordsCloud(newWordsCloud);
    }, [words]);
   


    const [userWordCounts, setUserWordCounts] = useState([]);

    useEffect(() => {
      
        const newUserWordCounts = [];

       
        words.forEach(item => {
           
            let userCount = 0;

           
            item.words.forEach(word => {
              
                if (wordsArray.includes(word)) {
                    userCount++;
                }
            });

          
            newUserWordCounts.push({ name: item.name, count: userCount });
        });

       
        setUserWordCounts(newUserWordCounts);
    }, [words, wordsArray]);

    console.log(userWordCounts);

 

    const generateGreenColors = (count) => {
        const greenColors = [];
        for (let i = 0; i < count; i++) {
          const greenValue = Math.floor(Math.random() * (256 - 120) + 120); // Генерируем случайное значение для компоненты G (зеленого цвета) в диапазоне от 45 до 255
          const color = `rgb(0, ${greenValue}, 0)`; // Формируем строку RGB цвета, в которой красная и синяя компоненты равны 0
          greenColors.push(color); // Добавляем цвет в массив
        }
        return greenColors;
      };

    const handleNextClick = () => {
        const newWordsArray = text.split(',').map(word => word.trim().toLocaleLowerCase());
        setWordsArray(newWordsArray);
        socket.emit("createTheRoom");
        console.log(newWordsArray); 
        setWordsPrepared(true); 
    };
    
    
    return (
        <div style={{ backgroundColor: "black", height: "100%", width: "100%" }}>
            {wordsArePrepared ? (
                <div style={{width:"100%", height:"100%"}} >
                    <div className={styles.Hdr}>
                        <div style={{ backgroundColor: "white", fontSize:"24pt", fontWeight:"600", borderRadius:"30px", padding:"5px", width:"150px" }}>{code}</div>
                    </div>
                    <div style={{display:"flex", width:"100%", height:"calc(100% - 46px)", flexDirection:"row"}}>
                    <div style={{width:"400px",height:"calc(100% - 46px)"}}>

                    <Chat Messages = {Messages}></Chat>
                    </div>
                    <div className={styles.Tree}><div style={{height:"400px", border:"1px solid red" , width:"calc(100% - 300px)"}}><ReactWordcloud words={wordsCloud} options={{ rotations: 0,  colors:generateGreenColors(35), fontSizes: [30, 30] }} /></div> </div>
                    <div>

                    </div>
                    </div>
                    <div style={{ backgroundColor:"black"}}>
                        <LeaderBoard Leaders={userWordCounts}></LeaderBoard>

                    </div>
                  
                </div>
            ) : (
                <div style={{ backgroundColor: "black", height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <strong style={{ color: "white", margin: "10px", fontSize: "20pt" }}>Введите загаданные слова</strong>
                    <textarea
                        className={styles.Input}
                        type="text"
                        value={text}
                        onChange={handleChange}
                        placeholder="Введите текст"
                    />
                    <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center" }}>
                        <button className={styles.BTNNext} onClick={handleNextClick}>Дальше</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Host;
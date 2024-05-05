import React from 'react';
import styles from './styles/leaders.module.css'
function Leaderboard({ Leaders }) {
    const maxCount = Math.max(...Leaders.map(leader => leader.count));

    return (
        <div style={{width:"calc(100% - 20px)",height:"100%"}}>
            {Leaders.map((leader, index) => (
                <div className={styles.line} key={index} style={{ width: `calc(${leader.count / maxCount * 100}%)`, padding:"5px",backgroundColor:"red"  }}>
                    <span style={{color:"white"}} >{leader.name}</span>
                    <span style={{color:"white"}}>: {leader.count}</span>
                </div>
            ))}
        </div>
    );
}

export default Leaderboard;

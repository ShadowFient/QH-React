import React, {useState,useEffect} from 'react';
import {Card} from 'react-bootstrap';

const PodClientMap = () => {
const [pcm,setPcm] = useState([]);

useEffect(()=>{
async function fetchData(){
const res = await fetch('http://127.0.0.1:5000/pcm');
res.json().then(res=>setPcm(res))
}
fetchData();
});

// return(
//     <div>
//         {Object.keys(pcm).map(key=><h2>Pod {key}: {
//         pcm[key].map(client=><span>{client}&ensp;</span>)}</h2>)}
//     </div>
// );
return(
    <div>
        {Object.keys(pcm).map(key=><Card style={{width: '18rem'}}><Card.Body><Card.Title>Pod {key}:</Card.Title> {
        pcm[key].map(client=><span>{client}&ensp;</span>)}</Card.Body></Card>)}
    </div>
);

};
export default PodClientMap;
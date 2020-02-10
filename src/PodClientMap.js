import React, {useState,useEffect} from 'react';

const PodClientMap = () => {
const [pcm,setPcm] = useState([]);

useEffect(()=>{
async function fetchData(){
const res = await fetch('http://127.0.0.1:5000/pcm');
res.json().then(res=>setPcm(res))
}
fetchData();
});

return(
    <div>
        {Object.keys(pcm).map(key=><h2>Pod {key}: {
        pcm[key].map(client=><span>{client}&ensp;</span>)}</h2>)}
    </div>
);

};
export default PodClientMap;
import React, {Component} from 'react';

class PodToClient extends Component{
    constructor(props){
        super(props);
        this.state = {
            pcm: [],
        };
    }
    componentDidMount(){
        this.setState({isLoading:true}[0]);
        fetch('http://127.0.0.1:5000/pcm')
    .then(response => response.json())
    .then(data => {this.setState({pcm: data})
    console.log(this.state.pcm)})
    .catch(error => console.log('Error:', error));
        
    }
    render(){
        //STILL A WORK IN PROGRESS -- CSS COMPONENTS NEED TO BE ADDED
        //simply outputs pods to html webpage
        const pcm = Object.keys(this.state.pcm).map(key=><h2>Pod {key}: {
        this.state.pcm[key].map(client=><span>{client}&ensp;</span>)}</h2>)
        return(
            
            <div>
                {pcm}
            </div>
        );
    }
}
export default PodToClient;
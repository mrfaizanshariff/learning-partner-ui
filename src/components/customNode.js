import React , {useEffect,useRef,useState} from 'react'
import { Handle } from 'reactflow'
import './customNode.css'
import { nodeSelectionObservable } from '../services/msg-bus-service'

const CustomNode = ({data}) => {
    const [isActive,setIsActive] = useState(false)
   useEffect(() => {
    const unsubscribe = nodeSelectionObservable((val)=>{
        console.log('val :', val )
        console.log('data :', data )
        if(val?.selectedNodeId == data?.id)
        setIsActive(true);
        else
        setIsActive(false)
    });
    return ()=> unsubscribe();
   },[])
  return (
    <div  className={isActive ? 'active node-container':'node-container'} >
        <Handle type='target' position='top' id='a'/>
        <div className='node-content-wrapper'>
            <div className='node-title'>
                <h6>{data?.keyword}</h6>
            </div>
            <hr></hr>
            <div className='node-desc'>
                <p>{data?.answer}</p>
            </div>
        </div>
        <Handle type='source' position='bottom' id='a'/>
    </div>
  )
}

export default CustomNode

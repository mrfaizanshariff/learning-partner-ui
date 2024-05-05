import ReactFlow, { Controls, Background,Handle, MiniMap, addEdge,useNodesState,useEdgesState } from 'reactflow';
import { useState, useCallback } from 'react';
import 'reactflow/dist/style.css';
import CustomNode from '../customNode';
import UploadButton from '../Upload-btn';
import './Flow.css'
import { uploadPdf,getAnswer } from '../../services/shared-services';
import {setNodeSelection,nodeSelectionObservable} from '../../services/msg-bus-service'
//setting up state for the nodes and edges

const nodeTypes = {
  customNode: CustomNode
}
const initialNodes = [
    {
        id:'1',
        type:'customNode',
        position:{x:500, y:100},
        data:{keyword:'Hello money',id:'1'},
    }
]
const initialEdges =[]
const keywords = ['How','What','Why','Explain','Pros','Cons'];

function Flow() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setselectedNode] = useState(null);
    const [selectedNodePosition, setSelectedNodePosition] = useState(null);
    const [selectedKeyword, setSelectedKeyword] = useState(null);
    const [answerData, setAnswerData] = useState('Dummy answer');
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isActive, setIsActive] = useState(false);

  const onNodeClick = (event, node) => {
    setselectedNode(node);
    setSelectedNodePosition(node.position);
    setIsActive(!isActive);
    setNodeSelection({selectedNodeId: node.id,isSelected: true});
  };
  const addNodeAsChild = () => {

    const payload={
      question_keyword:selectedKeyword,
      root_topic: nodes[0]?.data?.keyword,
      response: nodes.filter(node=> selectedNode.parentId === node.id).map(node=> node.data.answer).toString(),
      question1: nodes.filter(node=> selectedNode.parentId === node.id).map(node=> node.data.keyword).toString()
    }
    console.log(payload)
    getAnswer(payload).subscribe(answer =>{
      console.log(answer)
    })
    if (selectedNode.id) {
      const newNodeId = nodes.length + 1 + selectedNode.id;
      const newNode = {
        id: newNodeId,
        type:'customNode',
        data: { keyword: selectedKeyword,answer:answerData+newNodeId,id:newNodeId },
        position: { x: selectedNodePosition.x + 10, y: selectedNodePosition.y + 80  },
        parentId: selectedNode.id,
      };
  
      const newEdge = {
        id: `e${selectedNode.id}-${newNodeId}`,
        source: selectedNode.id,
        target: newNodeId,
        animated: true,
      };
  
      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) => eds.concat(newEdge));
      setIsModalOpen(false)
    }
    
    // nodes.forEach(element => {
    //   if(selectedNode.id.length-1 == element.id.length){
    //     if(selectedNode.id.includes(Number(element.id))){
    //       prevNode = element
    //     }
    //   }
    // });
  };
  const deleteNode=()=>{
    // need to find the selected id and also check the nodes which includes the selectedid
    // in their id string, if yes delete those and the corresponding edges also similar to node deletion
    if(selectedNode && selectedNode.id != 1){
      const nodesTobeDeleted = nodes.filter(node => !node.id.includes(selectedNode.id))
      const edgesTobeDeleted = edges.filter(edge => !edge.id.includes(selectedNode.id))
      setNodes(nodesTobeDeleted);
      setEdges(edgesTobeDeleted);
    }
  }
  const onKeywordSelect = (keyword)=>{
    if(selectedNode?.id){
      setSelectedKeyword(keyword)
      setIsModalOpen(true)
    }
  }
  const onModalClose =()=>{
    setIsModalOpen(false)
  }
  const onCanvasClick =()=>{
    setselectedNode(null)
    setIsActive(!isActive);
    setNodeSelection({selectedNodeId:-1,isSelected:false});

  }
 
  return (
    <div style={{ height: '100%' }}>
      <div className='keyword-panel'>
        {keywords?.map((keyword,id)=>(
          <button key={id} onClick={()=>onKeywordSelect(keyword)}>
            {keyword}
          </button>
        ))}
        <button onClick={deleteNode}>
          Delete Node
        </button>
      </div>
      <div className='upload-btn-container'>
        <UploadButton/>
      </div>
      {
        isModalOpen && (
        <div className='modal-container'>
          <div className='modal-content'>
            <div>
            <h2>{selectedKeyword}</h2>
            <p>{answerData}</p>
            </div>
            <div style={{display:'flex', gap:'20px'}}>

          <button className='close-button' onClick={addNodeAsChild}>
            Add to playground
          </button>
          <button className='close-button' onClick={onModalClose}>
            close
          </button>
            </div>
          </div>
          
        </div>
        )
      }
      <ReactFlow 
      onPaneClick={onCanvasClick}
      nodes={nodes}
      edges={edges}
      // onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      // fitView
      onNodeClick={onNodeClick}
      // onElementClick={onElementClick}
      >
        <Background />
        <Controls />
        <MiniMap/>
      </ReactFlow>
    </div>
  );
}



export default Flow;
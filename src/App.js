
import React, { useCallback, useEffect, useMemo, useRef,useState } from 'react';
import './App.css';
import { getOtherPeople, getSearch} from './fetch'


/* const storage=React.lazy(()=>JSON.parse(localStorage.getItem('favorito'))); 
const storage=JSON.parse(localStorage.getItem('favorito'));console.log(storage)*/
const storage=JSON.parse(localStorage.getItem('favorito'));
 function App() {
   const input=useRef('')
   const isDupli=useRef(false);
   const currentPage=useRef(1)

   
   
   const [people, setPeople]= useState([])
   const [page, setPage]=useState(1)
   const [peopleFeature, setPeopleFeature]=useState(null)
   const [search,setSearch]=useState('')
   const [queBusca, setQueBusca]=useState('')
   const [select, setSelect]=useState('a->z')
   const [favorito,setFavorito]=useState(storage||[])
   
   
   

  function getPage(arg){
    currentPage.current=currentPage.current+arg;
    if (currentPage.current<1 ){return}
    if (currentPage.current>9 ){return}
    setPage(currentPage.current); console.log('getPage')
    
    }
  
  function showFeature(id){
    
    let {birth_year, name, gender, height}=sortedPeople[id]
    setPeopleFeature ({birth_year,name, height,gender})
    const array=[...sortedPeople].map((ele,idx)=>{
      if(idx===id){ele.favourite=!ele.favourite}
      return ele
      }); console.log(array,'array')
    /* let array=[...favorito,sortedPeople[id]]
    setFavorito(array) */
  }
 
  function handleRemove(id){
    const array=favorito.filter((item, index)=>{if(index!==id) return item})
    setFavorito(array)
  }

    
    useEffect(()=>{
      
      localStorage.removeItem('favorito');
      (favorito.length>0&&localStorage.setItem('favorito', JSON.stringify(favorito)))
    },[favorito])
    
  

  
  const handleChange=()=>{
    //setQueBusca(input.current.value)
    setSearch(input.current.value)

    
  }

  /* const useBounce=(value,delay)=>{
    const[bounce,setBounce]=useState(value)
    useEffect(()=>{
      const timeOutId=setTimeout(()=>setBounce(value),delay)
      return ()=>clearTimeout(timeOutId)
    },[value,delay])
    console.log(bounce,'<<','>>',queBusca)
    return bounce
  }
  const searching=useBounce(queBusca,300) */
  
  /* const handleBuscar=(e)=>{
    if(e.keyCode===13){setSearch(queBusca);}
  }
  onKeyDown={(e)=>handleBuscar(e)} */
  useEffect(()=>{
 
  
  if(isDupli.current===false) {
    
      
     
      console.log('useEffect',favorito,'<favorito')
      
      
  setPeople([]);getPage(0);return ()=>
  isDupli.current=true;
}}
  
  ,[])

  useEffect(()=>{
    getOtherPeople(page).then(other=> {
     const sorted=[...other.results]
    /* if(select==='a->z'){sorted.sort((a,b)=>(a.name.localeCompare(b.name)))}
    else  sorted.sort((a,b)=>(b.name.localeCompare(a.name)))  */ 
    setPeople(sorted); console.log('getOtherPeople', sorted);
    setSearch('');
    setPeopleFeature('');
    
    });
  },[page])
 
  useEffect(()=>{
    console.log(search,'<<')
    if(!search)return
    const timeoutId=setTimeout(()=>{
      getSearch(search).then(success=>{
        const sorted=[...success.results]
        setPeople(sorted);
      })},800)

      setPeopleFeature('');
      console.log('>>',search)
      return ()=>clearTimeout(timeoutId)
      
      //setSearch(searching)
  },[search])

    
     const sortedPeople=useMemo(()=>{
       const beforeSorted=people.map((item)=>{return {...item, favourite:false}})
       console.log(beforeSorted,'beforeSorted')
      
      if(select==='a->z'){
        return (beforeSorted.sort((a,b)=>(a.name.localeCompare(b.name))));
      }
      else{
        return (beforeSorted.sort((a,b)=>(b.name.localeCompare(a.name))));
           }
      
    },[people,select]) 
   
     
    

  return (
    <div>
     {people.length===0?<span>is Loading...</span>: 
     (<div style={{paddingLeft:'300px'}}>
      
      <input    style={{marginTop:'20px'}} ref={input} onChange={()=>handleChange()} placeholder='search character'/>
        <ul style={{minHeight:'220px', width:'200px'}}>
          {sortedPeople?.map((personaje,idx)=><li className={personaje.favourite?'fav':''} key={idx} onClick={()=>showFeature(idx)}>{personaje.name}</li>)||<li>Luke Skywalker</li>}
        </ul>

      {!search?(<div>
        <button style={{width:'100px'}} onClick={()=>getPage(-1)}>previous</button>
        <span style={{margin:'10px'}}>{page}</span>
        <button style={{width:'100px'}} onClick={()=>getPage(+1)} >next</button>
      </div>):<button style={{width:'100px'}} onClick={()=>window.location.reload()}>Return</button>}
        <label htmlFor='choose'>Choose how to sort:</label>
        <select  id='choose' value={select} onChange={(e)=>setSelect(e.target.value)}>
        <option defaultValue> -- select an option -- </option>
          <option value={'a->z'}>{'A->Z'}</option>
          <option value={'z->a'}>{'Z->A'}</option>
        </select>

        

        {peopleFeature &&<div style={{marginTop:'10px', borderTop:'3px solid ', width:'250px'}}>
        <span style={{color: peopleFeature.gender==='male'?'blue':''}} ><strong>Name:</strong> {peopleFeature.name}</span><br/>
        <span ><strong>Height:</strong> {peopleFeature.height} cm</span><br/>
        <span><strong>Birth year:</strong> {peopleFeature.birth_year} stellar date</span>
        </div>}
        
        {/* {favorito.length>0 &&
        <div style={{borderTop:'2px solid green'}}>
          <h3>Characters favorites</h3>
          <ul>
          {favorito.map((ele,index)=>{return <li  key={index} onClick={()=>handleRemove(index)}><strong>{ele.name}</strong></li>})||<li>Luke Skywalker</li>}
          </ul>

        </div>}
 */}
        
       
      
    </div>)}
    </div>
  );
}

export default App;

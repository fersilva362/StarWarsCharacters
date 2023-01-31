  export async function getPeople(){
 const response=await fetch('https://swapi.dev/api/people');
 const data= await response.json();
  return data
} 
 


export async function getOtherPeople(page){
  const response=await fetch(`https://swapi.dev/api/people/?page=${page}`)
  const data=await response.json()
  return data
}
///api/people/?search
export async function getSearch(busqueda){
  
  const response=await fetch(`https://swapi.dev/api/people/?search=${busqueda}`)
  const data=await response.json()
  return data
}
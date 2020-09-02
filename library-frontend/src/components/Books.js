import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS} from '../queries'


const Books = (props) => {

  
  const [genre, setGenre] = useState('')
  const booksResult = useQuery(ALL_BOOKS, {
    variables: {genre: genre,},
    pollInterval: 2000
  })
  //console.log(booksResult.data.allBooks)
  const [genres, setGenres] = useState([])

  if(genre){
    console.log('genre')
    var data = sessionStorage.getItem('data')

    console.log('data')
    console.log(JSON.parse(data))
    if(JSON.parse(data) === genre){
      console.log('checked')
      setTimeout(function(){

        const radiobutton = document.getElementById(genre)
        if(radiobutton){
          radiobutton.checked = true
        }

      }, 200)
      
    }
}

  
  useEffect(() => {

    if(!genre){
    if(booksResult.data){
      const books = booksResult.data.allBooks
      const length = books.length
      let genres = []
      let i
  
      for(i = 0; i < length; i++){
  
        for(const genre of books[i].genres){
          genres.push(genre)
        } 
      }
      genres = [...new Set(genres)]
      setGenres(genres)
      
    }
  }

  }, [booksResult, genre])
  

  if (!props.show) {
    return null
  }

  const handleClick =  (event) => {

    //event.preventDefault()
    setGenre(event.target.value)
    
    sessionStorage.setItem("data", JSON.stringify(event.target.id))
  
  } 

  if(!booksResult.data){
    return(
       <div>
         <p>loading</p>
    </div>)
  }


  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {booksResult.data.allBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>Choose a genre</h2>
      <form>
        <div>
        <div><label>all</label><input onClick={handleClick} key='all' name='genre' type='radio' value=''/></div>
          {genres.map(g =><div><label>{g}</label> <input onClick={handleClick} key={g} id = {g} value = {g} name='genre' type='radio'/></div>)}
          </div>
          </form>  
    </div>
  )
}

export default Books
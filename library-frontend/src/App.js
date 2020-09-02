
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import {  useApolloClient } from '@apollo/client'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import './index.css'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  
  

  const handleLogOut = () => {
    console.log('logout')
    setToken('')
    localStorage.clear()
    client.resetStore()
    console.log(token)
  }


  const loggedIn = () => (
    <div>
         <p>logged in</p>
         <button onClick={handleLogOut}>Log Out</button>
        </div>

  )


  return (

  
    
      <div>
      {
      token === null ?
       <div id='loginapp'><LoginForm setToken={setToken} /></div>
       : loggedIn()
    }


      
        {token === null ? <span><button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button></span> :<span><button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button><button onClick={() => setPage('recommendations')}>recommendations</button>
        <button onClick={() => setPage('add')}>add book</button></span>}
   
      
      
      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />
      <Recommendations show={page === 'recommendations'}/>


      </div>

      
    
  )
}

export default App
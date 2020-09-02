  
import React, { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import { useQuery, useMutation } from '@apollo/client'
import CustomSelect from './CustomSelect'


const Authors = (props) => {

  const authorsResult = useQuery(ALL_AUTHORS)
  const [name, setName] = useState('')
  const [setBornTo, setSetBornTo] = useState('')
  
  

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{query: ALL_AUTHORS}],
    onError: (error) => {
      console.log(error.graphQLErrors[0])
    }
  })

 
  const submit = async (event) => {

    event.preventDefault()
    if(name === '') {
      alert('Fill out field "name"')
      return
    }

    if(setBornTo === '') {
      alert('Fill out field "born"')
      return
    }

    editAuthor({
      variables: { name, setBornTo }
    })

    //setName('')
    setSetBornTo('')

  }

  if (!props.show) {
    return null
  }
  

  if(authorsResult.loading) {
    return <div>loading...</div>
  }

  

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authorsResult.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>
        Set birthyear
      </h2>
      <form onSubmit={submit}>
      <div>
        <CustomSelect authors = {authorsResult.data.allAuthors.map(a => a.name) } onChange = {(value) => setName(value.value) }/>
      </div>
      <div>
        born <input value={setBornTo}
               onChange={({ target }) => setSetBornTo(parseInt(target.value))}></input>
      </div>
      <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default Authors

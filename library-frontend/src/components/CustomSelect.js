import React from 'react'
import Select from 'react-select'



const CustomSelect = (props) => {

    const options=props.authors.map(a => ({label: a, value: a}))

    return(
        <div>
            <Select options = {options} onChange = {props.onChange}/>
        </div>
    )
}

export default CustomSelect


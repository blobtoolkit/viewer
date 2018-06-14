import React from 'react'

const Suggestions = (props) => {
  const options = props.results.map((r,i) => (
    <li
      onClick={()=>props.onChooseTerm(r.term)}
      key={r.term+'_'+r.field}>
      {r.term} <small>[{r.field}]</small> &ndash; {r.names.slice(0,10).join(', ')}
    </li>
  ))
  return <ul>{options}</ul>
}

export default Suggestions

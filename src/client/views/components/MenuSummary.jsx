import React from 'react'
import styles from './Layout.scss';
import Spinner from './Spinner'
import { format as d3Format } from 'd3-format'

const SelectedFraction = ({value,total}) => {
  return (
    <span>

    </span>
  )
}

const TabbedFraction = ({value,total,color='rgba(0,0,0,0)',title='total',sel=false}) => {
  let css = styles.colored_tab;
  value = Math.max(value,0)
  let portion = value / total
  let percent = d3Format(".1%")(portion)
  total = d3Format(",.0f")(total)
  value = d3Format(",.0f")(value)
  return (
    <tr>
      <td>
        <span
          className={css}
          style={{backgroundColor:color}}>
          &nbsp;
        </span>
      </td>
      <td className={styles.left_align}>
        {title}
      </td>
      <td>
        {sel ? (
          <span>
            <span className={styles.highlight}>
              {value}
            </span> /
          </span>
        ) : ' '}
      </td>
      <td>
        {total}
      </td>
      <td>
        {sel ? (
          <span className={styles.highlight}>
            {percent}
          </span>
        ) : ' '}
      </td>

    </tr>
  )
}

const MenuSummary = ({values,zAxis,bins,palette,other,fullSummary}) => {

  let css = styles.long_menu_item
  let counts = []
  let reduced = []
  let listDiv
  console.log(fullSummary)
  if (bins){
    bins.forEach((bin,i) => {
      let title = bin.id
      let color = palette.colors[i]
      let value = values.counts.selBinned[i]
      let total = values.counts.binned[i]
      if (total){
        counts[i] = <TabbedFraction key={i} {...{value,total,color,title,sel:values.reduced.sel}}/>
        value = values.reduced.selBinned[i]
        total = values.reduced.binned[i]
        reduced[i] = <TabbedFraction key={i} {...{value,total,color,title,sel:values.counts.sel}}/>
      }
    })
    if (other){
      let list = []
      other.forEach((id,i) => {
        list.push(<span key={i}><span className={styles.no_break}>{id}</span>, </span>)
      })
      listDiv = (<div className={css}>
        <h3>Other Taxa</h3>
        {list}
      </div>)
    }
  }
  return (
    <div>
      <div className={css}>
        <h3>{zAxis}</h3>
        <table className={styles.right_align}>
          <tbody>
            <TabbedFraction value={values.reduced.sel} total={values.reduced.all} sel={values.reduced.sel}/>
            {reduced}
          </tbody>
        </table>
      </div>
      <div className={css}>
        <h3>counts</h3>
        <table className={styles.right_align}>
          <tbody>
            <TabbedFraction value={values.counts.sel} total={values.counts.all} sel={values.counts.sel}/>
            {counts}
          </tbody>
        </table>
      </div>
      {listDiv}
    </div>
  )
}

export default MenuSummary

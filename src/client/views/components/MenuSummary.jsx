import React from 'react'
import styles from './Layout.scss';
import Spinner from './Spinner'
import { format as d3Format } from 'd3-format'

const SelectedFraction = ({value,total}) => {
  value = Math.max(value,0)
  let portion = value / total
  let percent = d3Format(".1%")(portion)
  total = d3Format(",.0f")(total)
  value = d3Format(",.0f")(value)
  return (
    <span>
      <span className={styles.highlight}>
        {value}
      </span>
      &nbsp;/&nbsp;
      {total} (<span className={styles.highlight}>{percent}</span>)
    </span>
  )
}

const TabbedFraction = ({value,total,color='rgba(0,0,0,0)',title='total'}) => {
  let css = styles.colored_tab;
  return (
    <div>
      <span
        className={css}
        style={{backgroundColor:color}}>
        &nbsp;
      </span>
      &nbsp;
      <SelectedFraction {...{value,total}}/>
      &nbsp;&ndash;&nbsp;{title}
    </div>
  )
}

const MenuSummary = ({values,zAxis,bins,palette}) => {

  let css = styles.long_menu_item
  let counts = []
  let reduced = []
  if (bins){
    bins.forEach((bin,i) => {
      let title = bin.id
      let color = palette.colors[i]
      let value = values.counts.selBinned[i]
      let total = values.counts.binned[i]
      if (total){
        counts[i] = <TabbedFraction key={i} {...{value,total,color,title}}/>
        value = values.reduced.selBinned[i]
        total = values.reduced.binned[i]
        reduced[i] = <TabbedFraction key={i} {...{value,total,color,title}}/>
      }
    })
  }
  return (
    <div>
      <div className={css}>
        <h3>{zAxis}</h3>
        <TabbedFraction value={values.reduced.sel} total={values.reduced.all}/>
        {reduced}
      </div>
      <div className={css}>
        <h3>counts</h3>
        <TabbedFraction value={values.counts.sel} total={values.counts.all}/>
        {counts}
      </div>
    </div>
  )
}

export default MenuSummary

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

class TabbedFraction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {padTop: false}
  }

  handleDragEnter(e,title) {
    e.preventDefault()
    if (this.props.setTarget && title != 'other'){
      if (!this.state.padTop){
        this.setState({padTop:true})
      }
      this.props.setTarget(title)
    }

  }
  handleDragLeave(e,title) {
    e.preventDefault()
    if (this.props.setTarget){
      this.setState({padTop:false})
      setTimeout(()=>{
        this.props.removeTarget(title)
      },100)
    }
  }

  // handleDragEnd(e) {
  //   e.preventDefault()
  //   if (this.state.padTop){
  //     this.setState({padTop:false})
  //     this.props.setTarget()
  //   }
  // }

  render() {
    let {value,total,color='rgba(0,0,0,0)',title='total',sel=false} = this.props
    let css = styles.colored_tab;
    value = Math.max(value,0)
    let portion = value / total
    let percent = d3Format(".1%")(portion)
    total = d3Format(",.0f")(total)
    value = d3Format(",.0f")(value)
    let style = this.state.padTop ? ({ paddingTop: this.props.padTop}) : {}
    return (
      <tr onDragEnter={(e)=>this.handleDragEnter(e,title)}
          onDragLeave={(e)=>this.handleDragLeave(e,title)}
          onDragOver={(e)=>{e.preventDefault()}}
          onDrop={(e)=>{e.preventDefault()}}>
        <td style={style}>
          <span
            className={css}
            style={{backgroundColor:color}}>
            &nbsp;
          </span>
        </td>
        <td className={styles.left_align} style={style}>
          {title}
        </td>
        <td style={style}>
          {sel ? (
            <span>
              <span className={styles.highlight}>
                {value}
              </span> /
            </span>
          ) : ' '}
        </td>
        <td style={style}>
          {total}
        </td>
        <td style={style}>
          {sel ? (
            <span className={styles.highlight}>
              {percent}
            </span>
          ) : ' '}
        </td>

      </tr>
    )
  }
}

class MenuSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {source: false, target: false, title: false}
  }

  setTarget(title, target){
    if (title){
      this.setState({title, target})
    }
  }

  removeTarget(title, target){
    if (this.state.title == title){
      this.setState({title:false, target:false})
    }
  }

  handleDragStart(e, source){
    this.setState({source})
  }

  handleDragEnd(e){
    e.preventDefault()
    if (e.dataTransfer.dropEffect == 'move'
        && (this.state.target || this.state.target === 0)){
      this.changeOrder(this.state, this.props.bins)
    }
    this.setState({source: false, target: false, title: false})
  }

  changeOrder(state,bins){
    let values = {}
    let taxa = []
    let list
    let param = `${this.props.catAxis}--Order`
    let current = this.props.parsed[param]
    if (current){
      let arr = current.split(',')
      if (arr.length >= state.target){
        arr.splice(state.target,0,state.source)
        list = arr.join(',')
      }
    }
    if (!list) {
      for (let i=0; i < state.target; i++){
        taxa.push(bins[i].id)
        list = `${taxa.join(',')},${state.source}`
      }
    }
    values[param] = list
    this.props.onChangeOrder(values,[])
    // this.props.changeQueryParams(Object.assign({[param]: list},this.props.parsed))
  }

  render() {
    let {values,zAxis,catAxis,bins,palette,other,fullSummary,parsed} = this.props
    let css = styles.long_menu_item
    let counts = []
    let reduced = []
    let listDiv
    let reset
    if (parsed[`${catAxis}--Order`]){
      reset = (<div className={styles.reset}
           onClick={()=>{this.props.onChangeOrder({},[`${catAxis}--Order`])}}
           >reset</div>)
    }
    if (bins){
      bins.forEach((bin,i) => {
        let title = bin.id
        let color = palette.colors[i]
        let value = values.counts.selBinned[i]
        let total = values.counts.binned[i]
        if (total){
          counts[i] = <TabbedFraction handleDrop={i > 0 && this.handleDrop}
                                      setTarget={(t)=>this.setTarget(t, i)}
                                      removeTarget={(t)=>this.removeTarget(t, i)}
                                      padTop={this.state.source ? '1.5em' : '0.5em'}
                                      key={i}
                                      {...{value,total,color,title,sel:values.reduced.sel}}/>
          value = values.reduced.selBinned[i]
          total = values.reduced.binned[i]
          reduced[i] = <TabbedFraction key={i} {...{value,total,color,title,sel:values.counts.sel}}/>
        }
      })
      if (other && other.length){
        let list = []
        other.forEach((id,i) => {
          let css = styles.no_break
          list.push(
              <span key={i}>
                <span draggable={true}
                      className={css}
                      style={{cursor:'pointer'}}
                      onDrag={(e)=>this.handleDragStart(e,id)}
                      onDragEnd={(e)=>this.handleDragEnd(e)}>
                  {id}
                </span>, </span>
            )
        })
        listDiv = (<div className={css}>
          {reset}
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
}

export default MenuSummary

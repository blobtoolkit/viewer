import React from 'react'
import styles from './Filters.scss'

class FilterControlRange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {low:props.filterRange[0],high:props.filterRange[1],clamp:props.meta.clamp}
  }
  componentWillUpdate(nextProps) {
    if (nextProps.filterRange[0] != this.props.filterRange[0] || nextProps.filterRange[1] != this.props.filterRange[1]){
      this.setState({low:nextProps.filterRange[0],high:nextProps.filterRange[1]})
    }
  }
  isNumeric(n) {
    if ((typeof n === 'undefined') || n == 'NaN') return false
    return !isNaN(parseFloat(n)) && isFinite(n)
  }
  render() {
    let clamp
    if (this.props.meta.clamp && this.props.meta.clamp > 0){
       clamp = (
         <input
           type='number'
           className={styles.clamp_input}
           value={this.state.clamp}
           onChange={e=>{
             let value = e.target.value;
             let clamp
             this.setState({clamp:value})
           }}
           onKeyUp={
             (e)=>{
               if (e.key === 'Enter') {
                 e.target.blur()
               }
             }
           }
           onBlur={
             (e)=>{
               let value = e.target.value;
               let clamp
               if (this.props.filterLimit[0] < value && this.props.filterLimit[1] > value){
                 this.setState({clamp:value})
                 this.props.onUpdateClamp(this.props.meta.id,value)
               }
               else {
                 this.props.onUpdateClamp(this.props.meta.id,this.props.meta.clamp)
               }
             }
           }
           data-tip data-for='clamp-input' />
       )
    }
    return (
      <div className={styles.headliner}>
        {clamp}
        <div rel={this.props.filterRange[0]} className={styles.range}>
          <input
            type='number'
            className={styles.range_input}
            value={this.state.low}
            onChange={e=>{
              this.setState({low:e.target.value})
            }}
            onKeyUp={
              (e)=>{
                if (e.key === 'Enter') {
                  e.target.blur()
                }
              }
            }
            onBlur={
              (e)=>{
                let range = this.props.filterRange;
                let value = e.target.value;
                let index = 1
                if (this.props.filterLimit[0] <= value){
                  range[0] = value
                }
                else {
                  range[0] = this.props.filterLimit[0]
                  this.setState({low:range[0]})
                  index = -1
                }
                this.props.onUpdateRange(this.props.filterId,range,index)
              }
            }
            data-tip data-for='range-input' />
          &nbsp;:&nbsp;
          <input
            type='number'
            className={styles.range_input}
            value={this.state.high}
            onChange={e=>{
              this.setState({high:e.target.value})
            }}
            onKeyUp={
              (e)=>{
                if (e.key === 'Enter') {
                  e.target.blur()
                }
              }
            }
            onBlur={
              (e)=>{
                let range = this.props.filterRange;
                let value = e.target.value;
                console.log(value)
                let index = 2
                if (this.props.filterLimit[1] >= value){
                  range[1] = value
                }
                else {
                  range[1] = this.props.filterLimit[1]
                  this.setState({high:range[1]})
                  index = -2
                }
                this.props.onUpdateRange(this.props.filterId,range,index)
              }
            }
            data-tip data-for='range-input' />
        </div>
      </div>
    )
  }
}


export default FilterControlRange

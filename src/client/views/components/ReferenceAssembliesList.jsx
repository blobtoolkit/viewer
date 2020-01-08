import React from 'react'
import { connect } from 'react-redux'
import { getReferenceValues,
  resetReferenceValues,
  fetchReferenceValues } from '../reducers/reference'
import styles from './Layout.scss'
import SVGIcon from './SVGIcon'
import ellipsisIcon from './svg/ellipsis.svg'

export default class ReferenceAssembliesList extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => ({
        current: getReferenceValues(state)
      })
    },
    this.mapDispatchToProps = () => {
      return (dispatch) => ({
        reset: (field) => dispatch(resetReferenceValues(field)),
        fetchValues: (field, id, last) => dispatch(fetchReferenceValues(field, id, last))
      })
    }
  }

  render(){
    const ConnectedReferenceList = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(ReferenceList)
    return (
      <ConnectedReferenceList {...this.props} />
    )
  }
}

class ReferenceList extends React.Component {
  constructor(props) {
    super(props);
    let ids = Object.keys(this.props.current.byId)
    let expand = ids.length > 0
    ids = (ids.map(id=>id.split('--')[0]) || []).join(', ')
    this.state = {ids, expand}
  }

  handleChange(e) {
    e.preventDefault()
    this.setState({ids: e.target.value});
  }

  toggleForm() {
    this.setState({expand: !this.state.expand});
  }

  handleSubmit(e){
    e.preventDefault()
    if (!this.state.ids){
      this.props.reset('length')
      return
    }
    let ids = this.state.ids.trim().split(/[\W+\.-]/)
    this.updateReferenceList(ids)
  }

  updateReferenceList(ids){
    this.props.reset('length')
    let list = ids.filter(x=>(x && x.length > 0))
    let params = {}
    list.forEach((id,i)=>{
      let last
      params[`${id}--length--Active`] = true
      if (i == list.length - 1){
        last = params
      }
      this.props.fetchValues('length', id, last)
    })
  }

  render(){
    return (
      <div>
        <div className={styles.simple}>
          <h1 className={styles.inline}>reference assemblies</h1>
          <span className={styles.simple_buttons}>
            <SVGIcon sprite={ellipsisIcon} active={this.state.expand} onIconClick={()=>this.toggleForm()}/>
          </span>
        </div>
        <div>
          <form className={this.state.expand ? '' : styles.hidden} onSubmit={(e)=>this.handleSubmit(e)}>
            <input type="submit" value="update" className={styles.menuButton}/>
            <label>
              <textarea rows="3"
                        value={this.state.ids}
                        placeholder={'Enter a list dataset IDs'}
                        className={styles.menuTextarea}
                        onChange={(e)=>this.handleChange(e)} />
            </label>
          </form>
        </div>
      </div>

    )
  }
}

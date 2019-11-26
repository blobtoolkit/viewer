import React from 'react'
import { connect } from 'react-redux'
import CookieConsent from 'react-cookie-consent'
import styles from './Layout.scss'
import colors from './_colors'
import { getDatasetIsActive, getReloading, setReloading, getStaticThreshold } from '../reducers/repository'
import { getQueryString, setQueryString, getDatasetID, getHashString, getStatic } from '../reducers/location'
import { getBinsForCat } from '../reducers/field'
import { getCatAxis } from '../reducers/plot'
import { getSelectedDatasetMeta } from '../reducers/dataset'
import LayoutControls from './LayoutControls'
import LayoutHeader from './LayoutHeader'
import LayoutPlots from './LayoutPlots'
import ExternalLink from './ExternalLink'
import Spinner from './Spinner'
import BTKLogos from './BTKLogos'
import DOIBadge from './DOIBadge'
import { queryToStore } from '../querySync'
import qs from 'qs'

const branch = BRANCH || ''
const version = VERSION || ''
const git_version = GIT_VERSION || ''
const hash = COMMIT_HASH || ''
const gdpr_url = GDPR_URL || ''

window.scrollTop = {}

class LayoutComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  handleScroll(e,tab){
    window.scrollTop[tab] = e.target.scrollTop
  }

  render(){
    let message = 'We use browser cookies to analyse traffic to this site. To use this site you must agree to our ';
    let url = 'https://github.com/blobtoolkit/viewer'
    // {this.props.datasetId ? this.props.active ? <LayoutPlots/> : <Spinner/> : <LayoutPlots/> }
    let notice = (
      <CookieConsent
          style={{ background: colors.darkColor}}
          contentStyle= {{ margin:'15px' }}
          buttonText='Accept'
          declineButtonText='Decline'
          enableDeclineButton={true}
          cookieValue={true}
          declineCookieValue={false}
          buttonStyle={{ backgroundColor: colors.highlightColor,
            color: colors.lightColor,
            border: `${colors.lightColor} solid 1px`,
            fontSize: "13px" }}
          declineButtonStyle={{ backgroundColor: colors.lightColor,
            color: colors.highlightColor,
            border: `${colors.highlightColor} solid 1px`,
            fontSize: "13px" }}
          flipButtons={true}
        >
        This website uses cookies to help us monitor usage.
        To allow us to do this, please accept the terms of our <a style={{textDecoration:'underline', color:colors.highlightColor, fontWeight:'bold'}}
           href={gdpr_url} target='_blank'>
           Privacy Policy
         </a>.
      </CookieConsent>
    )
    return (
      <div className={styles.main}>
        <div className={styles.main_header}>
          <LayoutHeader/>
        </div>
        <div className={styles.content}>
          <LayoutControls/>
          <div className={styles.plot_area}>
            <LayoutPlots />
          </div>
        </div>
        <div className={styles.main_footer}>
          <span style={{float:'left'}}>
            BlobToolKit Viewer <a style={{color:'white'}} href={url} target={git_version}>{version}</a>
          </span>
          <span style={{float:'left', marginLeft:'1em'}}>
            <a style={{color:'white'}} href='https://doi.org/10.1101/844852' target='_blank'>Challis <i>et al.</i> 2019</a>
          </span>
          <BTKLogos/>
          {notice}
        </div>
      </div>
    )
  }
}

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        // active: getDatasetIsActive(state),
        //queryString: getQueryString(state),
        reloading: getReloading(state),
        // bins: getBinsForCat(state),
        // cat: getCatAxis(state),
        // staticThreshold: getStaticThreshold(state),
        // meta: getSelectedDatasetMeta(state),
        // datasetId: getDatasetID(state),
        // isStatic: getStatic(state),
        //activeTab: getHashString(state)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        updateStore: (str,currentSearch,action) => {
          let values = qs.parse(str.replace('?',''))
          dispatch(queryToStore({values,searchReplace:true,currentSearch,action}))
        },
        updateQueryString: (qStr) => dispatch(setQueryString(qStr))
      }
    }
  }

  render(){
    const ConnectedLayout = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(LayoutComponent)
    return <ConnectedLayout {...this.props}/>
  }
}

export default Layout

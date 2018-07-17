import React from 'react';
import { connect } from 'react-redux'
import { Router, Switch, Route, withRouter } from 'react-router-dom'
import styles from './Layout.scss'

const MenuHelpMain = ({match,datasetId,view}) => {
  switch (match.params.view || 'blob') {
    case 'blob':
      view = 'Blob text'
      break
    case 'cumulative':
      view = 'Cumulative text'
      break
    case 'snail':
      view = 'Snail text'
      break
    case 'table':
      view = 'Table text'
      break
    case 'treemap':
      view = 'TreeMap text'
      break
  }
  return (
    <span>
      <p>
        This is an alpha release, full documentation will be added once the viewer
        is more feature-complete.
      </p>
      Further information and code are available in the project <a href="https://github.com/blobtoolkit/viewer">Github repository</a>.
      <p>
        {view}
      </p>
    </span>
  )
};

export default withRouter(MenuHelpMain)

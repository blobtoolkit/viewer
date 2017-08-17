import React from 'react'
import Header from './Header';
import Main from './Main';
import styles from './App.scss';

// this component will be rendered by our <___Router>
const App = () => (
  <div className={styles.app}>
    <Header className={styles.header}/>
    <Main className={styles.main}/>
  </div>
)

module.exports = App;

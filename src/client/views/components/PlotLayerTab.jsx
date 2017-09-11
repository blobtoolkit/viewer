import React from 'react';
import styles from './Plot.scss'

const PlotLayerTab = ({ layer, color, onMouseOver }) => (
  <div className={styles.layer_tab} style={{backgroundColor:color}} onMouseEnter={onMouseOver}/>
);

export default PlotLayerTab;

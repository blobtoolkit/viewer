import React from 'react';
import styles from './Icon.scss'
import ReactTooltip from 'react-tooltip'

const SVGIcon = ({ sprite, active, onIconClick = ()=>{} }) => (
  <div className={styles.icon}
    data-tip data-for={sprite.id}>
    <svg viewBox={sprite.viewBox}
      className={active ? styles.active : ''}
      onClick={onIconClick}>
      <use xlinkHref={'#'+sprite.id} />
    </svg>
    <ReactTooltip id={sprite.id}>{sprite.id}</ReactTooltip>
  </div>
);

export default SVGIcon

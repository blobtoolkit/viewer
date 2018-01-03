import React from 'react';
import styles from './Icon.scss'

const SVGIcon = ({ sprite, active, onIconClick = ()=>{} }) => (
  <div className={styles.icon}
    data-tip data-for={sprite.id}>
    <svg viewBox={sprite.viewBox}
      className={active ? styles.active : ''}
      onClick={onIconClick}>
      <use xlinkHref={'#'+sprite.id} />
    </svg>

  </div>
);

export default SVGIcon

import React from 'react';
import styles from './Layout.scss'
import uoeLogo from './img/uoe-logo.png'
import enaLogo from './img/ena-logo.png'
import bbsrcLogo from './img/bbsrc-logo.png'

const BTKLogos = ({}) => {
  return (
    <span className={styles.logo}>
      <a href='http://blobtoolkit.genomehubs.org'>
        <img src={uoeLogo} alt='UoE' />
      </a>
      <a href='https://bbsrc.ukri.org'>
        <img src={bbsrcLogo} alt='BBSRC' />
      </a>
      <a href='https://www.ebi.ac.uk/ena'>
        <img src={enaLogo} alt='ENA' />
      </a>
    </span>
  )
}

export default BTKLogos

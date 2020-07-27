import * as React from 'react';
import styles from './styles.css';

class ModalBackdrop extends React.Component {
  render() {
    return <div className={`${styles.modalBackdrop} dn`}></div>;
  }
}

export default ModalBackdrop;

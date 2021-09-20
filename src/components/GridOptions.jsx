import React from 'react';

import styles from '../styles/GridOptions.module.css';

const GridOptions = () => {
  return (
    <div className={styles.container}>
      <button>View</button>
      <button>Delete</button>
    </div>
  );
};

export default GridOptions;

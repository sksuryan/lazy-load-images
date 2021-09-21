import React, { useEffect, useRef, useState } from 'react';

import styles from '../styles/GridItem.module.css';
import GridOptions from './GridOptions';

const GridItem = ({ src, imageData }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div
      className={styles.container}
      onMouseEnter={() => {
        setShowOptions(true);
      }}
      onMouseLeave={() => {
        setShowOptions(false);
      }}
    >
      <div
        className={styles.imageContainer}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <img src={imageData ? imageData : URL.createObjectURL(src)} />
      </div>
      {showOptions && <GridOptions />}
    </div>
  );
};

export default GridItem;

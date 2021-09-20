import React, { useEffect, useRef, useState } from 'react';
import loadImage from 'blueimp-load-image';

import styles from '../styles/GridItem.module.css';
import GridOptions from './GridOptions';

const GridItem = ({ src }) => {
  const ImageContainerRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    loadImage(src, {
      canvas: true,
      maxWidth: 120,
      maxHeight: 120,
      cover: true,
    }).then((data) => {
      ImageContainerRef.current.append(data.image);
    });
  }, []);

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
        ref={ImageContainerRef}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      ></div>
      {showOptions && <GridOptions />}
    </div>
  );
};

export default GridItem;

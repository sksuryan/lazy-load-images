import React, { useEffect, useState } from 'react';
import GridItem from './GridItem';
import styles from '../styles/Grid.module.css';
import LazyLoad from 'react-lazyload';

const Grid = ({ images }) => {
  console.log(images);
  return (
    <div className={styles.container}>
      {images.map((src) => (
        <LazyLoad key={src.name} height={120} offset={80} once>
          <GridItem src={src} />
        </LazyLoad>
      ))}
    </div>
  );
};

export default Grid;

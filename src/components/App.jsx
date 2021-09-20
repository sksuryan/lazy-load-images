import React, { useState } from 'react';
import styles from '../styles/App.module.css';
import Grid from './Grid';

const App = () => {
  const [images, setImages] = useState([]);

  return (
    <div className={styles.main}>
      <input
        type='file'
        multiple
        onChange={(e) => {
          setImages([...e.target.files]);
        }}
        accept='image/*'
      />
      <Grid images={images} />
    </div>
  );
};

export default App;

import React, { memo } from 'react';
import GridItem from './GridItem';
import { areEqual, FixedSizeGrid } from 'react-window';
import memoizeOne from 'memoize-one';
import loadImage from 'blueimp-load-image';

const Cell = memo(({ data, rowIndex, columnIndex, style }) => {
  const key = 5 * rowIndex + columnIndex;

  const { images, imageSrc } = data;

  if (key < images.length && !imageSrc[key]) {
    loadImage(images[key], {
      canvas: true,
      maxWidth: 120,
      maxHeight: 120,
      cover: true,
    }).then((data) => {
      imageSrc[key] = data.image.toDataURL();
    });
  }

  return key < images.length ? (
    <div
      style={{
        ...style,
        left: style.left + 8,
        top: style.top + 8,
        width: style.width - 8,
        height: style.height - 8,
      }}
    >
      <GridItem src={images[key]} imageData={imageSrc[key]} />
    </div>
  ) : (
    <></>
  );
}, areEqual);

const MemoizeData = memoizeOne((images, imageSrc) => ({
  images,
  imageSrc,
}));

const Grid = ({ images }) => {
  const itemData = MemoizeData(images, {});

  return (
    <FixedSizeGrid
      columnCount={5}
      columnWidth={128}
      height={600}
      rowCount={
        images.length % 5 > 0 ? images.length / 5 + 1 : images.length / 5
      }
      rowHeight={128}
      width={128 * 5 + 32}
      itemData={itemData}
      style={{ marginTop: '1rem' }}
    >
      {Cell}
    </FixedSizeGrid>
  );
};

export default Grid;

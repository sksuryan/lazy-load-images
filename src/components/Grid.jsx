import React, { memo } from 'react';
import GridItem from './GridItem';
import { areEqual, FixedSizeGrid } from 'react-window';

const Grid = ({ images }) => {
  const Cell = memo(({ data, rowIndex, columnIndex, style }) => {
    const key = 5 * rowIndex + columnIndex;

    console.log(key);

    return key < data.length ? (
      <div
        style={{
          ...style,
          left: style.left + 8,
          top: style.top + 8,
          width: style.width - 8,
          height: style.height - 8,
        }}
      >
        <GridItem src={data[key]} />
      </div>
    ) : (
      <></>
    );
  }, areEqual);

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
      itemData={images}
      style={{ marginTop: '1rem' }}
    >
      {Cell}
    </FixedSizeGrid>
  );
};

export default Grid;

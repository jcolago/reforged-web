import React from 'react';
import { Card } from '@mui/material'

interface Props {
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  padding?: string | number;
  margin?: string | number;
  style?: React.CSSProperties;
}

const GlobalCard: React.FC<Props> = ({
  children,
  width: width,
  height: height,
  padding: padding,
  margin: margin,
  style = {},
}) => {
  const cardStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    padding: typeof padding === 'number' ? `${padding}px` : padding,
    margin: typeof margin ==='number' ? `${margin}px` : margin,
    ...style
  };

  return (
    <Card style={cardStyle}>
      {children}
    </Card>
  );
};

export default GlobalCard;
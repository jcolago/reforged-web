import React from 'react';
import { Card } from '@mui/material'

interface CustomCardProps {
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  padding?: string | number;
  style?: React.CSSProperties;
}

const CustomCard: React.FC<CustomCardProps> = ({
  children,
  width: width,
  height: height,
  padding: padding,
  style = {},
}) => {
  const cardStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    padding: typeof padding === 'number' ? `${padding}px` : padding,
    ...style
  };

  return (
    <Card style={cardStyle}>
      {children}
    </Card>
  );
};

export default CustomCard;
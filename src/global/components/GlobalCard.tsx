import React from 'react';
import { Card, SxProps, Theme } from '@mui/material';

interface Props {
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  padding?: string | number;
  sx?: SxProps<Theme>;
  style?: React.CSSProperties;
  className?: string;
}

const GlobalCard: React.FC<Props> = ({
  children,
  width,
  height,
  padding,
  sx = {},
  style = {},
  className,
}) => {
  const baseStyles: SxProps<Theme> = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    padding: typeof padding === 'number' ? `${padding}px` : padding,
    ...sx,
  };

  return (
    <Card sx={baseStyles} style={style} className={className}>
      {children}
    </Card>
  );
};

export default GlobalCard;

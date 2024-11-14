import React from 'react';
import { Button, SxProps, Theme } from '@mui/material';

interface Props {
  width?: string | number;
  height?: string | number;
  padding?: string | number;
  margin?: string | number;
  marginTop?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
  marginRight?: string | number;
  title?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  backgroundColor?: string;
  color?: string;
  style?: React.CSSProperties;
  sx?: SxProps<Theme>;
}

const ButtonContained: React.FC<Props> = ({
  width,
  height,
  padding,
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  title,
  onClick,
  children,
  disabled,
  type = 'button',
  className,
  backgroundColor,
  color,
  style,
  sx,
}) => {
  const combinedStyle: React.CSSProperties = {
    width: width,
    height: height,
    padding: padding,
    margin: margin,
    marginTop: marginTop,
    marginBottom: marginBottom,
    marginLeft: marginLeft,
    marginRight: marginRight,
    backgroundColor: backgroundColor,
    color: color,
    ...style,
  };

  return (
    <Button
      variant="contained"
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={className}
      style={combinedStyle}
      sx={sx}
    >
      {children || title}
    </Button>
  );
};

export default ButtonContained;

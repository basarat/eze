import * as React from 'react';
import { style } from 'typestyle';
import * as styles from '../../internal/styles';

export const Error = ({ children }: { children?: any }) => {
  return <p className={style({
    color: styles.colors.errorText,
    margin: '0px',
    lineHeight: '24px'
  })} children={children} />;
}

export const P = ({ children }: { children?: any }) => {
  return <p className={style({
    color: styles.colors.text,
    margin: '0px',
    lineHeight: '24px'
  })} children={children} />;
}

export const H1 = ({ children, id }: { children?: any, id?: string }) => {
  return <h1 className={style({
    margin: '0px',
    color: styles.colors.text,
    lineHeight: 1.5,
  })}
    id={id} children={children} />;
}
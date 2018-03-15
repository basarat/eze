import * as React from 'react';
import { style, classes } from 'typestyle';
import * as typestyle from 'typestyle';
import * as styles from '../../internal/styles';
import { AnchorStyles } from './anchor';


export const Button: React.SFC<{ text: string, onClick: () => void }> = (props) => {
  return (
    <button className={AnchorStyles.anchorLookingLikeButton} onClick={props.onClick}>{props.text}</button>
  );
}

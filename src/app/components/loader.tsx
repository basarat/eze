import * as styles from '../../internal/styles';
import * as typestyle from 'typestyle';
import { style, classes } from 'typestyle';
import * as React from 'react';

namespace LoaderStyles {
  const spinnerRotate = typestyle.keyframes({
    '0%': {
      transform: 'rotate(0deg)'
    },
    '100%': {
      transform: 'rotate(360deg)'
    }
  })

  export const rootClassName = typestyle.style({
    background: 'transparent',

    /** Set it up with a side missing */
    color: styles.colors.text,
    borderStyle: 'solid',
    borderTopColor: 'currentColor',
    borderLeftColor: 'currentColor',
    borderRightColor: 'currentColor',
    borderBottomColor: 'transparent',

    /** Setup to be a circle */
    borderRadius: '100%',

    /** Animation */
    animation: `${spinnerRotate} .75s linear infinite`,

    borderWidth: '2px',
    height: '20px',
    width: '20px',
  });
}

export const Loader = ({ }) => {
  return <div className={classes(LoaderStyles.rootClassName)}/>
}
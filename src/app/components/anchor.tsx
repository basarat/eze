import * as React from 'react';
import { style, classes } from 'typestyle';
import * as typestyle from 'typestyle';
import * as styles from '../../internal/styles';

export namespace AnchorStyles {
  /** Since we support non HREF anchors we do this as well explicitly */
  const nonHrefAnchor = {
    cursor: 'pointer',
    textDecoration: 'underline',
    background: 'transparent',
    border: 'none',
    padding: '0px',
  }

  export const rootClassName = typestyle.style(
    nonHrefAnchor,
    {
      color: styles.colors.text,
      $nest: {
        '&:hover': {
          color: styles.colors.headerHover,
        },
        '&:focus': {
          outline: 'thin dotted',
          outlineColor: styles.colors.text
        }
      }
    }
  );

  export const anchorLookingLikeButton = style({
    cursor: 'pointer',
    height: 'auto',
    padding: "12px 30px 11px",
    border: `1px solid ${styles.colors.header}`,
    borderRadius: '3px',
    color: styles.colors.white,
    backgroundColor: styles.colors.header,
    fontSize: styles.fontSizes.buttonText,
    textDecoration: "none",
    lineHeight: "1em",
    outline: 'none',
    transition: 'color .2s, background-color .2s',
    display: 'inline-block',
    $nest: {
      '&:hover': {
        backgroundColor: styles.colors.headerHover,
      },
      '&:active': {
        backgroundColor: styles.colors.headerHover,
      },
      '&:focus': {
        outline: 'thin dotted',
        outlineColor: styles.colors.header
      }
    }
  });
}

export interface AnchorProps {
  id?: string;
  href?: string;
  target?: "_blank";
  children?: React.ReactNode;
  download?: boolean;
  onClick?: React.EventHandler<React.MouseEvent<any>>;
  className?: string;
}

export const Anchor = (props: AnchorProps) => {
  return (
    <a className={classes(AnchorStyles.rootClassName, props.className)}
      id={props.id}
      href={props.href}
      target={props.target}
      onClick={props.onClick}>
      {props.children}
    </a>
  );
}

export const AnchorButton: React.SFC<{ href: string }> = (props) => <a className={AnchorStyles.anchorLookingLikeButton} href={props.href}>
  {props.children}
</a>;

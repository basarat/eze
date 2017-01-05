import * as types from '../../types';
import * as React from 'react';
import * as txt from './txt';
import * as gls from './gls';
import { style, classes } from 'typestyle';
import * as csstips from 'csstips';
import { colors } from '../../internal/styles';

namespace TocStyles {
  export const tocAnchorClass = style(
    csstips.padding(5, 5, 5, 10),
    {
      background: '#eee',
      color: colors.text,
      textDecoration: 'none',
      $nest: {
        '&:hover': {
          color: colors.text,
          background: '#ddd',
        }
      }
    }
  );

  export const marginLeft = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    return {
      marginLeft: (level * 5) + 'px'
    };
  }
}

const renderTocEntry = (t: types.TableOfContentEntry) => <a key={t.level + t.id} className={classes(
  TocStyles.tocAnchorClass,
)} style={TocStyles.marginLeft(t.level)} href={"#" + t.id}>
  {t.text}
</a>;

export const Toc = ({ toc }: { toc: types.TableOfContentEntry[] }) => <gls.ContentVerticalContentMargined>
  <txt.H1 id={'toc'}>Table of Contents</txt.H1>
  <gls.ContentVertical>
    {
      toc.map((t) => {
        return [renderTocEntry(t)].concat(t.subItems.map(renderTocEntry))
      })
    }
  </gls.ContentVertical>
</gls.ContentVerticalContentMargined>;

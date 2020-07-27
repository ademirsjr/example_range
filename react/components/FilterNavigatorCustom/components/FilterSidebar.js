import classNames from 'classnames';
import React, { useState, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { IconFilter, IconArrowBack } from 'vtex.store-icons';
import { useCssHandles } from 'vtex.css-handles';
import ContentLoader from 'react-content-loader';

import Sidebar from './SideBar';

import styles from '../searchResult.css';

const CSS_HANDLES = [
  'filterPopupButton',
  'filterPopupTitle',
  'filterButtonsBox',
  'filterPopupArrowIcon',
  'filterClearButtonWrapper',
  'filterApplyButtonWrapper',
];

const FilterSidebar = ({ children, open, handleClose, handleOpen }) => {
  const handles = useCssHandles(CSS_HANDLES);

  return (
    <Fragment>
      <button
        className={classNames(
          `${styles.filterPopupButton} ph3 pv5 mv0 mv0 pointer justify-center items-center dn`,
          {
            'bb b--muted-1': open,
            'bn': !open,
          },
        )}
        onClick={handleOpen}
      >
        <span
          className={`${handles.filterPopupTitle} c-on-base t-action--small ml-auto`}
        >
          <FormattedMessage id="store/search-result.filter-action.title" />
        </span>
        <span className={`${handles.filterPopupArrowIcon} ml-auto pl3 pt2`}>
          <IconFilter size={16} viewBox="0 0 17 17" />
        </span>
      </button>

      <Sidebar onOutsideClick={handleClose} isOpen={open}>
        <div
          className={`${styles.filterMobileSidebar} ${
            styles['filters--layout']
          } h-100 overflow-scroll z-5`}
        >
          <div
            className={`${styles.filterMobileSidebarHeader} w-100 dib flex items-center ph5 pv3 fixed z-2`}
          >
            <button
              className={`${styles.filterMobileSidebarHeaderBack} pa2 pointer`}
              onClick={handleClose}
            >
              <IconArrowBack size={18} />
            </button>

            <div
              className={`${styles.filterMobileSidebarTitle} tc flex-auto white`}
            >
              <FormattedMessage id="store/search-result.filter-bar.title" />
            </div>
          </div>
          {children}
        </div>
      </Sidebar>
    </Fragment>
  );
};

export default FilterSidebar;

import React from 'react';
import { useRuntime } from 'vtex.render-runtime';
import classNames from 'classnames';
import { useCssHandles } from 'vtex.css-handles';
import { Icon } from 'vtex.store-icons';

import styles from './searchResult.css';

const CSS_HANDLES = ['orderByOptionItem'];

const SelectionListItem = ({ option, onItemClick, selected }) => {
  const { setQuery } = useRuntime();
  const handles = useCssHandles(CSS_HANDLES);

  const handleOptionClick = () => {
    onItemClick();
    setQuery({ order: option.value, page: undefined });
  };

  const highlight = selected ? 'bg-light-gray' : 'hover-bg-muted-5 bg-base';

  return !option.icon ? (
    <button
      className={classNames(
        handles.orderByOptionItem,
        highlight,
        ' bg-white c-on-base f5 ml-auto db no-underline pointer tl bn pv5 ph5 w-100 right-0',
      )}
      key={option.value}
      onClick={handleOptionClick}
    >
      {option.label}
    </button>
  ) : (
    <button
      className={classNames(
        handles.orderByOptionItem,
        highlight,
        ' bg-white c-on-base f5 ml-auto db no-underline pointer tl bn pv5 ph5 w-100 right-0',
      )}
      key={option.value}
      onClick={handleOptionClick}
    >
      <span className={styles.orderByOptionItemIcon}>
        <Icon id={option.icon} size="16" viewBox="0 0 18 18" />
      </span>
      {option.label}
    </button>
  );
};

export default SelectionListItem;

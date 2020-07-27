import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { Icon } from 'vtex.store-icons';
import { withDevice } from 'vtex.device-detector';
import styles from '../searchResult.css';
import ContextFilter from './ContextFilter';

const FilterButtonCustom = props => {
  const { isModalOpen, setIsModalOpen } = useContext(ContextFilter);
  const handleFilter = isMobile => {
    try {
      const searchDefault = '/seminovo?map=tipo';
      const origin = window.location.origin;
      const search = window.location.search;

      const filterButtonOpenTitleAutoComplete = document.querySelectorAll(
        "button[class*='filterButtonOpenTitleAutoComplete']",
      );
      if (filterButtonOpenTitleAutoComplete.length > 0) {
        filterButtonOpenTitleAutoComplete.click();
      } else {
        if (props.page === 'store.home') {
          console.log('props.page');
          window.location.href = origin + searchDefault;
        }
        if (isMobile) {
          console.log(isModalOpen, 'contexto');
          setIsModalOpen(true);
        }
      }
    } catch (error) {
      console.error(`Erro no FilterButton: ${error}`);
    }
  };

  return (
    <div
      className={
        (props.isMobile
          ? styles.filterButtonOpenMobile
          : styles.filterButtonOpen) +
        (props.css || '') +
        (!props.isMobile && props.showInDesktop === 'False' ? ' dn' : '')
      }
      style={{ cursor: 'pointer' }}
      onClick={() => handleFilter(props.isMobile)}
    >
      <span
        className={
          (props.isMobile
            ? styles.filterButtonOpenIconMobile
            : styles.filterButtonOpenIcon) + (props.css || '')
        }
      >
        <Icon
          id="mpa-filter-settings"
          type="filled"
          size="20"
          viewBox="0, 0, 20, 20"
        />
      </span>
      <span
        className={
          (props.isMobile
            ? styles.filterButtonOpenTitleMobile
            : styles.filterButtonOpenTitle) + (props.css || '')
        }
      >
        {props.title || ''}
      </span>
    </div>
  );
};

FilterButtonCustom.propTypes = {
  title: PropTypes.string,
  css: PropTypes.string,
  showInDesktop: PropTypes.string,
};

export default compose(withDevice)(FilterButtonCustom);

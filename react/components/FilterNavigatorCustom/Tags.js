import React from 'react';

import SelectedFilters from './components/SelectedFilters';

const Tags = Component => () => {
  return (
    <div>
      <Component />
    </div>
  );
};

export default Tags(SelectedFilters);

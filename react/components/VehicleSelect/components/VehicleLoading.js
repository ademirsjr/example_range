import React from 'react';

import ContentLoader from 'react-content-loader';

const VehicleLoading = () => {
  return (
    <div className="mv5 pl5">
      <ContentLoader
        style={{
          width: '90%',
          height: '130px',
        }}
        width="100%"
        height="100%"
        y="0"
        x="0"
      >
        <rect width="100%" height="1em" />
        <rect width="100%" height="3em" y="2em" />
        <rect width="100%" height="3em" y="6em" />
        <rect width="100%" height="3em" y="10em" />
      </ContentLoader>
    </div>
  );
};

export default VehicleLoading;

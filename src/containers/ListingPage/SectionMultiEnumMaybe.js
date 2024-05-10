import React from 'react';
import { Heading, PropertyGroup } from '../../components';

import css from './ListingPage.module.css';

const SectionMultiEnumMaybe = props => {
  const { heading, options, selectedOptions, index } = props;
  if (!heading || !options || !selectedOptions) {
    return null;
  }

  if(selectedOptions.length > 0){
    return (
      <section className={css.sectionMultiEnum}>
        <Heading as="h1" rootClassName={css.sectionHeading}>
          {heading} {index}
        </Heading>
        <PropertyGroup
          id="ListingPage.amenities"
          options={options}
          selectedOptions={selectedOptions}
          twoColumns={options.length > 5}
        />
      </section>
    );
  }else{
    return null;
  }
};

export default SectionMultiEnumMaybe;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Import configs and util modules
import { FormattedMessage } from '../../../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../../../util/types';
import { types as sdkTypes } from '../../../../util/sdkLoader';

// Import shared components
import { H3, ListingLink } from '../../../../components';

// Import modules from this directory
import EditListingPricingForm from './EditListingPricingForm';
import css from './EditListingPricingPanel.module.css';

const { Money } = sdkTypes;

const getInitialValues = params => {
  const { listing } = params;
  const { price } = listing?.attributes || {};

  return { price };
};

const EditListingPricingPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    marketplaceCurrency,
    listingMinimumPriceSubUnits,
    disabled,
    ready,
    onSubmit,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const initialValues = getInitialValues(props);
  const isPublished = listing?.id && listing?.attributes?.state !== LISTING_STATE_DRAFT;
  const priceCurrencyValid =
    marketplaceCurrency && initialValues.price instanceof Money
      ? initialValues.price.currency === marketplaceCurrency
      : !!marketplaceCurrency;
  const {unitType, listingType} = listing?.attributes?.publicData;

  const customListingType = listingType.replace('-rental','');

  return (
    <div className={classes}>
      <H3 as="h1">
        {isPublished ? (
          <FormattedMessage
            id="EditListingPricingPanel.title"
            values={{ listingTitle: <ListingLink listing={listing} />, lineBreak: <br /> }}
          />
        ) : (
          <FormattedMessage
            id="EditListingPricingPanel.createListingTitle"
            values={{ lineBreak: <br /> }}
          />
        )}
      </H3>
      {listingType ? (
        <div className={css.priceContainer}>
          <div className={css.perUnit}>
          <FormattedMessage id="EditListingPricingPanel.pricingPerListingType" values={{ customListingType }} />
          </div><br></br>
        </div>
      ):(
        <FormattedMessage
            id="EditListingPricingPanel.createListingTitle"
            values={{ lineBreak: <br /> }}
          />
      )}
      
      {priceCurrencyValid ? (
        <EditListingPricingForm
          className={css.form}
          initialValues={initialValues}
          onSubmit={values => {
            const { price } = values;

            // New values for listing attributes
            const updateValues = {
              price,
            };
            onSubmit(updateValues);
          }}
          marketplaceCurrency={marketplaceCurrency}
          unitType={unitType}
          listingMinimumPriceSubUnits={listingMinimumPriceSubUnits}
          saveActionMsg={submitButtonText}
          disabled={disabled}
          ready={ready}
          updated={panelUpdated}
          updateInProgress={updateInProgress}
          fetchErrors={errors}
        />
      ) : (
        <div className={css.priceCurrencyInvalid}>
          <FormattedMessage
            id="EditListingPricingPanel.listingPriceCurrencyInvalid"
            values={{ marketplaceCurrency }}
          />
        </div>
      )}
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditListingPricingPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingPricingPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingPricingPanel;
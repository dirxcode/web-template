import React from 'react';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import { formatMoney } from '../../util/currency';
import { LINE_ITEM_EXTRA_DAYS_FEE, propTypes } from '../../util/types';

import css from './OrderBreakdown.module.css';

const LineItemExtraDayFreeMaybe = props => {
  const { lineItems, intl } = props;

  const pickupFeeLineItem = lineItems.find(
    item => item.code === LINE_ITEM_EXTRA_DAYS_FEE && !item.reversal
  );

  const unitPrice = pickupFeeLineItem ? formatMoney(intl, pickupFeeLineItem.unitPrice) : null;
  const quantity = pickupFeeLineItem ? pickupFeeLineItem.quantity.toString() : null;

  return pickupFeeLineItem ? (
    <div className={css.lineItem}>
      <span className={css.itemLabel}>
        <FormattedMessage id="OrderBreakdown.baseUnitExtraDaysFee" values={{ unitPrice, quantity }}/>
      </span>
      <span className={css.itemValue}>{formatMoney(intl, pickupFeeLineItem.lineTotal)}</span>
    </div>
  ) : null;
};

LineItemExtraDayFreeMaybe.propTypes = {
  lineItems: propTypes.lineItems.isRequired,
  intl: intlShape.isRequired,
};

export default LineItemExtraDayFreeMaybe;
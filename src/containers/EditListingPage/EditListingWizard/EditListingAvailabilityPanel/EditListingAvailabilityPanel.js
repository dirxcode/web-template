import React, { useEffect, useState } from 'react';
import { arrayOf, bool, func, object, string } from 'prop-types';
import classNames from 'classnames';

// Import configs and util modules
import { FormattedMessage } from '../../../../util/reactIntl';
import { getDefaultTimeZoneOnBrowser, timestampToDate } from '../../../../util/dates';
import { LISTING_STATE_DRAFT, propTypes } from '../../../../util/types';
import { DAY, isFullDay } from '../../../../transactions/transaction';

// Import shared components
import { Button, H3, InlineTextButton, ListingLink, Modal } from '../../../../components';

// Import modules from this directory
import EditListingAvailabilityPlanForm from './EditListingAvailabilityPlanForm';
import EditListingAvailabilityExceptionForm from './EditListingAvailabilityExceptionForm';
import WeeklyCalendar from './WeeklyCalendar/WeeklyCalendar';

import css from './EditListingAvailabilityPanel.module.css';

// This is the order of days as JavaScript understands them
// The number returned by "new Date().getDay()" refers to day of week starting from sunday.
const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

// This is the order of days as JavaScript understands them
// The number returned by "new Date().getDay()" refers to day of week starting from sunday.
const rotateDays = (days, startOfWeek) => {
  return startOfWeek === 0 ? days : days.slice(startOfWeek).concat(days.slice(0, startOfWeek));
};

const defaultTimeZone = () =>
  typeof window !== 'undefined' ? getDefaultTimeZoneOnBrowser() : 'Etc/UTC';

//variable to insert data 
//for weekly and monthly
const defaultInsertDays = {
  timezone: "Asia/Jakarta",
  activePlanDays: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
  mon: [{startTime: "00:00", endTime: "24:00"}],
  tue: [{startTime: "00:00", endTime: "24:00"}],
  wed: [{startTime: "00:00", endTime: "24:00"}],
  thu: [{startTime: "00:00", endTime: "24:00"}],
  fri: [{startTime: "00:00", endTime: "24:00"}],
  sat: [{startTime: "00:00", endTime: "24:00"}],
  sun: [{startTime: "00:00", endTime: "24:00"}],
};

///////////////////////////////////////////////////
// EditListingAvailabilityExceptionPanel - utils //
///////////////////////////////////////////////////

// Create initial entry mapping for form's initial values
const createEntryDayGroups = (entries = {}) => {
  // Collect info about which days are active in the availability plan form:
  let activePlanDays = [];
  return entries.reduce((groupedEntries, entry) => {
    const { startTime, endTime: endHour, dayOfWeek } = entry;
    const dayGroup = groupedEntries[dayOfWeek] || [];
    activePlanDays = activePlanDays.includes(dayOfWeek)
      ? activePlanDays
      : [...activePlanDays, dayOfWeek];
    return {
      ...groupedEntries,
      [dayOfWeek]: [
        ...dayGroup,
        {
          startTime,
          endTime: endHour === '00:00' ? '24:00' : endHour,
        },
      ],
      activePlanDays,
    };
  }, {});
};

// Create initial values
const createInitialValues = availabilityPlan => {
  const { timezone, entries } = availabilityPlan || {};
  const tz = timezone || defaultTimeZone();
  return {
    timezone: tz,
    ...createEntryDayGroups(entries),
  };
};

// Create entries from submit values
const createEntriesFromSubmitValues = values => {
  const result = WEEKDAYS.reduce((allEntries, dayOfWeek) => {
    const dayValues = values[dayOfWeek] || [];
    const dayEntries = dayValues.map(dayValue => {
      const { startTime, endTime } = dayValue;
      // Note: This template doesn't support seats yet.
      if (startTime && endTime) {
        return {
          dayOfWeek,
          seats: 1,
          startTime,
          endTime: endTime === '24:00' ? '00:00' : endTime,
        };
      } else {
        return null;
      }
    });

    return allEntries.concat(dayEntries.filter(e => e !== null));
  }, []);
  return result;
};


// Create availabilityPlan from submit values
const createAvailabilityPlan = values => ({
  availabilityPlan: {
    type: 'availability-plan/time',
    timezone: values.timezone,
    entries: createEntriesFromSubmitValues(values),
  },
});



//////////////////////////////////
// EditListingAvailabilityPanel //
//////////////////////////////////
const EditListingAvailabilityPanel = props => {
  const {
    className,
    rootClassName,
    params,
    locationSearch,
    listing,
    monthlyExceptionQueries,
    weeklyExceptionQueries,
    allExceptions,
    onAddAvailabilityException,
    onDeleteAvailabilityException,
    disabled,
    ready,
    onFetchExceptions,
    onSubmit,
    onManageDisableScrolling,
    onNextTab,
    submitButtonText,
    updateInProgress,
    errors,
    config,
    routeConfiguration,
    defaultWeeklyDays,
    history,
  } = props;
  // Hooks
  const defaultAvailabilityPlan = {
    type: 'availability-plan/time',
    timezone: defaultTimeZone(),
    entries: [
      // { dayOfWeek: 'mon', startTime: '09:00', endTime: '17:00', seats: 1 },
      // { dayOfWeek: 'tue', startTime: '09:00', endTime: '17:00', seats: 1 },
      // { dayOfWeek: 'wed', startTime: '09:00', endTime: '17:00', seats: 1 },
      // { dayOfWeek: 'thu', startTime: '09:00', endTime: '17:00', seats: 1 },
      // { dayOfWeek: 'fri', startTime: '09:00', endTime: '17:00', seats: 1 },
      // { dayOfWeek: 'sat', startTime: '09:00', endTime: '17:00', seats: 1 },
      // { dayOfWeek: 'sun', startTime: '09:00', endTime: '17:00', seats: 1 },
    ],
  };

  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
  const [isEditExceptionsModalOpen, setIsEditExceptionsModalOpen] = useState(false);
  const [valuesFromLastSubmit, setValuesFromLastSubmit] = useState(null);
  const [availabilityPlan, setAvailabilityPlan] = useState(defaultWeeklyDays);
  const [hasAvailabilityPlan, setHasAvailabilityPlan] = useState(false);
  const [isInitialized,setIsInitialized] = useState(false);


  const firstDayOfWeek = config.localization.firstDayOfWeek;
  const classes = classNames(rootClassName || css.root, className);
  const listingAttributes = listing?.attributes;
  const {unitType, listingType} = listingAttributes?.publicData;
  const useFullDays = isFullDay(unitType);
  const customListingType = listingType.replace('-rental','');

  const isPublished = listing?.id && listingAttributes?.state !== LISTING_STATE_DRAFT;

  useEffect(() => {
    const isAvailabilityPlanExist = !!listingAttributes?.availabilityPlan;
    setIsInitialized(true);

    if (listingType !== 'daily-rental') {
      if (!isAvailabilityPlanExist && !isInitialized) {
        handleSubmit(defaultInsertDays);
        setHasAvailabilityPlan(true);
      } else {
        setHasAvailabilityPlan(isAvailabilityPlanExist);
      }
    } else if (listingType === 'daily-rental' && isInitialized) {
      setHasAvailabilityPlan(isAvailabilityPlanExist);
      setAvailabilityPlan(listingAttributes?.availabilityPlan || defaultWeeklyDays);
    } else if (!isInitialized) {
      setHasAvailabilityPlan(isAvailabilityPlanExist);
      setAvailabilityPlan(defaultWeeklyDays);
    }
  },[listingType, listingAttributes]);


  // const hasAvailabilityPlan = !!listingAttributes?.availabilityPlan;
  // const availabilityPlan = listingAttributes?.availabilityPlan || defaultAvailabilityPlan;
  const initialValues = valuesFromLastSubmit
    ? valuesFromLastSubmit
    : createInitialValues(availabilityPlan);

  const handleSubmit = values => {
    setValuesFromLastSubmit(values);

    // Final Form can wait for Promises to return.
    return onSubmit(createAvailabilityPlan(values))
      .then(() => {
        setIsEditPlanModalOpen(false);
      })
      .catch(e => {
        // Don't close modal if there was an error
      });
  };

  const sortedAvailabilityExceptions = allExceptions;

  // Save exception click handler
  const saveException = values => {
    const { availability, exceptionStartTime, exceptionEndTime, exceptionRange } = values;

    // TODO: add proper seat handling
    const seats = availability === 'available' ? 1 : 0;

    // Exception date/time range is given through FieldDateRangeInput or
    // separate time fields.
    const range = useFullDays
      ? {
          start: exceptionRange?.startDate,
          end: exceptionRange?.endDate,
        }
      : {
          start: timestampToDate(exceptionStartTime),
          end: timestampToDate(exceptionEndTime),
        };

    const params = {
      listingId: listing.id,
      seats,
      ...range,
    };

    return onAddAvailabilityException(params)
      .then(() => {
        setIsEditExceptionsModalOpen(false);
      })
      .catch(e => {
        // Don't close modal if there was an error
      });
  };

  return (
    <main className={classes}>
      <H3 as="h1">
        {isPublished ? (
          <FormattedMessage
            id="EditListingAvailabilityPanel.title"
            values={{ listingTitle: <ListingLink listing={listing} />, lineBreak: <br /> }}
          />
        ) : (
          <FormattedMessage
            id="EditListingAvailabilityPanel.createListingTitle"
            values={{ lineBreak: <br /> }}
          />
        )}
      </H3>

      <div className={css.planInfo}>
        {/* {!hasAvailabilityPlan && (
          <p>
            <FormattedMessage
              id={listingType === "daily-rental"
                ? "EditListingAvailabilityPanel.availabilityDailyPlanInfo"
                : "EditListingAvailabilityPanel.availabilityWeekMonthPlanInfo"}
            />
          </p>
        )} */}
        {
          listingType === "daily-rental" ? (
            <p>
              <span>For your </span>
              <span className={css.listingTypeInfo}>
                <FormattedMessage id="EditListingAvailabilityPanel.listingTypeInfo" values={{ customListingType }}/>
              </span>
              <FormattedMessage id="EditListingAvailabilityPanel.availabilityDailyPlanInfo" />
            </p>
          ) : (
            <p>
              <span>Your </span>
              <span className={css.listingTypeInfo}>
                <FormattedMessage id="EditListingAvailabilityPanel.listingTypeInfo" values={{ customListingType }}/>
              </span>
              <FormattedMessage id="EditListingAvailabilityPanel.availabilityWeekMonthPlanInfo"/>
            </p>
          )
        }
          {listingType === "daily-rental" && (
            hasAvailabilityPlan ? (
              <>
                <InlineTextButton
                    className={css.editPlanButton}
                    onClick={() => setIsEditPlanModalOpen(true)}
                >
                  <FormattedMessage id="EditListingAvailabilityPanel.editAvailabilityPlan" />
                </InlineTextButton>
              </>
            ) : (
              <>
                <InlineTextButton
                  className={css.editPlanButton}
                  onClick={() => setIsEditPlanModalOpen(true)}
                >
                  <FormattedMessage id="EditListingAvailabilityPanel.setAvailabilityPlan" />
                </InlineTextButton>
              </>
            )
          )}
        
      </div>

      {hasAvailabilityPlan ? (
        <>
          <WeeklyCalendar
            className={css.section}
            headerClassName={css.sectionHeader}
            listingId={listing.id}
            availabilityPlan={availabilityPlan}
            availabilityExceptions={sortedAvailabilityExceptions}
            weeklyExceptionQueries={weeklyExceptionQueries}
            isDaily={unitType === DAY}
            useFullDays={useFullDays}
            onDeleteAvailabilityException={onDeleteAvailabilityException}
            onFetchExceptions={onFetchExceptions}
            params={params}
            locationSearch={locationSearch}
            firstDayOfWeek={firstDayOfWeek}
            routeConfiguration={routeConfiguration}
            history={history}
          />

          <section className={css.section}>
            <InlineTextButton
              className={css.addExceptionButton}
              onClick={() => setIsEditExceptionsModalOpen(true)}
              disabled={disabled || !hasAvailabilityPlan}
              ready={ready}
            >
              <FormattedMessage id="EditListingAvailabilityPanel.addException" />
            </InlineTextButton>
          </section>
        </>
      ) : null}

      {errors.showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingAvailabilityPanel.showListingFailed" />
        </p>
      ) : null}

      {!isPublished ? (
        <Button
          className={css.goToNextTabButton}
          onClick={onNextTab}
          disabled={!hasAvailabilityPlan}
        >
          {submitButtonText}
        </Button>
      ) : null}

      {onManageDisableScrolling && isEditPlanModalOpen ? (
        <Modal
          id="EditAvailabilityPlan"
          isOpen={isEditPlanModalOpen}
          onClose={() => setIsEditPlanModalOpen(false)}
          onManageDisableScrolling={onManageDisableScrolling}
          containerClassName={css.modalContainer}
          usePortal
        >
          <EditListingAvailabilityPlanForm
            formId="EditListingAvailabilityPlanForm"
            listingTitle={listingAttributes?.title}
            availabilityPlan={availabilityPlan}
            weekdays={rotateDays(WEEKDAYS, firstDayOfWeek)}
            useFullDays={useFullDays}
            onSubmit={handleSubmit}
            initialValues={initialValues}
            inProgress={updateInProgress}
            fetchErrors={errors}
          />
        </Modal>
      ) : null}

      {onManageDisableScrolling && isEditExceptionsModalOpen ? (
        <Modal
          id="EditAvailabilityExceptions"
          isOpen={isEditExceptionsModalOpen}
          onClose={() => setIsEditExceptionsModalOpen(false)}
          onManageDisableScrolling={onManageDisableScrolling}
          containerClassName={css.modalContainer}
          usePortal
        >
          <EditListingAvailabilityExceptionForm
            formId="EditListingAvailabilityExceptionForm"
            listingId={listing.id}
            allExceptions={allExceptions}
            monthlyExceptionQueries={monthlyExceptionQueries}
            fetchErrors={errors}
            onFetchExceptions={onFetchExceptions}
            onSubmit={saveException}
            timeZone={availabilityPlan.timezone}
            isDaily={unitType === DAY}
            updateInProgress={updateInProgress}
            useFullDays={useFullDays}
          />
        </Modal>
      ) : null}
    </main>
  );
};

EditListingAvailabilityPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
  monthlyExceptionQueries: null,
  weeklyExceptionQueries: null,
  allExceptions: [],
  defaultWeeklyDays: null,
};

EditListingAvailabilityPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  monthlyExceptionQueries: object,
  weeklyExceptionQueries: object,
  allExceptions: arrayOf(propTypes.availabilityException),
  onAddAvailabilityException: func.isRequired,
  onDeleteAvailabilityException: func.isRequired,
  onSubmit: func.isRequired,
  onManageDisableScrolling: func.isRequired,
  onNextTab: func.isRequired,
  submitButtonText: string.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
  defaultWeeklyDays: object.isRequired,
};

export default EditListingAvailabilityPanel;
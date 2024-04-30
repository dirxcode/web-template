import React from 'react';
import loadable from '@loadable/component';

import { bool, object } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import NotFoundPage from '../../containers/NotFoundPage/NotFoundPage';

import { lenderSectionId, customPageId, } from './CMSPage.duck';
import { getListingsById } from '../../ducks/marketplaceData.duck';
import { SectionTabs } from '../PageBuilder/SectionBuilder';

const PageBuilder = loadable(() =>
  import(/* webpackChunkName: "PageBuilder" */ '../PageBuilder/PageBuilder')
);

const tabSectionType = 'tab';

export const CMSPageComponent = props => {
  const { params, pageAssetsData, listings, inProgress, error  } = props;
  const pageId = params.pageId || props.pageId;

  const pageData = pageAssetsData?.[customPageId]?.data;

  const lenderSectionIdx = pageData?.sections.findIndex(s => s.sectionName === lenderSectionId);
  const lenderSection = pageData?.sections[lenderSectionIdx];



  // Define the necessary props for the custom section
  const customLenderSection = {
    ...lenderSection,
    sectionId: lenderSectionId,
    sectionType: tabSectionType,
    listings: listings,
  };

  // Replace the original section with the custom section object
  // in custom page data
  const customPageData = pageData
    ? {
        ...pageData,
        sections: pageData.sections.map((s, idx) =>
          idx === lenderSectionIdx ? customLenderSection : s
        ),
      }
    : pageData;

  if (!inProgress && error?.status === 404) {
    return <NotFoundPage />;
  }

  return (
    <PageBuilder
      pageAssetsData={customPageData}
      inProgress={inProgress}
      schemaType="Article"
      options={{
        sectionComponents: {
          [tabSectionType]: { component: SectionTabs },
        },}
      }
    />
  );
};

CMSPageComponent.propTypes = {
  pageAssetsData: object,
  inProgress: bool,
};

const mapStateToProps = state => {
  const { pageAssetsData, inProgress, error } = state.hostedAssets || {};
  const { currentPageResultIds } = state.SearchPage;
  const listings = getListingsById(state, currentPageResultIds);
  return { pageAssetsData, listings, inProgress, error };
};

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const CMSPage = compose(
  withRouter,
  connect(mapStateToProps)
)(CMSPageComponent);

export default CMSPage;

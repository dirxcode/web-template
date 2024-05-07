import React from 'react';
import loadable from '@loadable/component';

import { bool, object } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { SectionTabs } from '../PageBuilder/SectionBuilder';

import NotFoundPage from '../../containers/NotFoundPage/NotFoundPage';
const PageBuilder = loadable(() =>
  import(/* webpackChunkName: "PageBuilder" */ '../PageBuilder/PageBuilder')
);

const customPageId= "how-it-works";
const lenderSectionId = 'lender_section';
const tabSectionType = 'tabs';

export const CMSPageComponent = props => {
  const { params, pageAssetsData, inProgress, error } = props;
  const pageId = params.pageId || props.pageId;

  if (!inProgress && error?.status === 404) {
    return <NotFoundPage />;
  }

  if(pageId == customPageId){
    const pageData = pageAssetsData?.[customPageId]?.data;
    const lenderSectionIdx = pageData?.sections.findIndex(s => s.sectionName === lenderSectionId);
    const lenderSection = pageData?.sections[lenderSectionIdx];
      // Define the necessary props for the custom section
    const customLenderSection = {
      ...lenderSection,
      sectionId: lenderSectionId,
      sectionType: tabSectionType,
      listings: [],
    };

    const customPageData = pageData
    ? {
        ...pageData,
        sections: pageData.sections.map((s, idx) =>
          idx === lenderSectionIdx ? customLenderSection : s
        ),
      }
    : pageData;
    return (
      <PageBuilder
      pageAssetsData={customPageData}
      inProgress={inProgress}
      schemaType="Article"
      options={{
        sectionComponents: {
          [tabSectionType]: { component: SectionTabs },
        },
      }}
    />
    );
  }else{
    return (
      <PageBuilder
        pageAssetsData={pageAssetsData?.[pageId]?.data}
        inProgress={inProgress}
        schemaType="Article"
      />
    );
  }
};

CMSPageComponent.propTypes = {
  pageAssetsData: object,
  inProgress: bool,
};

const mapStateToProps = state => {
  const { pageAssetsData, inProgress, error } = state.hostedAssets || {};
  return { pageAssetsData, inProgress, error };
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
import { fetchPageAssets } from '../../ducks/hostedAssets.duck';
import { searchListings } from '../SearchPage/SearchPage.duck';
import { createImageVariantConfig } from '../../util/sdkLoader';

export const lenderSectionId = 'lender_section';
export const customPageId = 'how-it-works';

const getLenderParams = (config, listingIds) => {

  const {
    aspectWidth = 1,
    aspectHeight = 1,
    variantPrefix = 'listing-card',
  } = config.layout.listingImage;

  const aspectRatio = aspectHeight / aspectWidth;

  return {
    ids: listingIds,
    include: ['author', 'images'],
    'fields.listing': [
      'title',
      'price',
      'publicData.transactionProcessAlias',
    ],
    'fields.user': ['profile.displayName', 'profile.abbreviatedName'],
    'fields.image': [
      'variants.scaled-small',
      'variants.scaled-medium',
      `variants.${variantPrefix}`,
      `variants.${variantPrefix}-2x`,
    ],
    ...createImageVariantConfig(`${variantPrefix}`, 400, aspectRatio),
    ...createImageVariantConfig(`${variantPrefix}-2x`, 800, aspectRatio),
    'limit.images': 1,
  };
}

export const loadData = (params, search, config) => dispatch => {
  const pageId = params.pageId;
  const pageAsset = { [pageId]: `content/pages/${pageId}.json` };
  const hasFallbackContent = false;

  return dispatch(fetchPageAssets(pageAsset, true)).then(assetResp => {
    const lenderSections = assetResp[customPageId].data.sections;

    const customLenderSection = lenderSections.find(
      s => s.sectionName === lenderSectionId
    );
    
    if (customLenderSection) {
      const blocks = customLenderSection?.blocks;
      let lenderListingIds=[];
      for(let i=0; i < blocks.length; i++){
        lenderListingIds.push(blocks[i].blockName);
      }
      const listingParams = getLenderParams(config, lenderListingIds);
      dispatch(searchListings(listingParams, config));
    }
  });
  
};

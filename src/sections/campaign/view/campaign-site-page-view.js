'use client'

import PropTypes from 'prop-types';

import CampaignHero from '../campaign-hero';

import CampaignContent from '../campaign-content';

export default function CampaignSitePageView({ campaigns, campaignsCount }) {
  return (
    <>
      <CampaignHero />

      <CampaignContent campaigns={campaigns} campaignsCount={campaignsCount} />
    </>
  );
}

CampaignSitePageView.propTypes = {
  campaigns: PropTypes.array,
  campaignsCount: PropTypes.number
}
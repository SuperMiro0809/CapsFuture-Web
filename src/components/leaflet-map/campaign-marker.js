import PropTypes from 'prop-types';
// react-leaflet
import { Marker } from 'react-leaflet';
//
import mapIcons from './icon-list';

export default function CampaignMarker({ latitude, longitude }) {
  return (
    <Marker
      position={[latitude, longitude]}
      icon={mapIcons.campaignIcon}
    />
  );
}

CampaignMarker.propTypes = {
  latitude: PropTypes.number,
  longitude: PropTypes.number
};

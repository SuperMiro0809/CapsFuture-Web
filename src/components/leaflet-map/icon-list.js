import L from 'leaflet';

// ----------------------------------------------------------------------

const heartIcon = new L.Icon({
    iconUrl: '/assets/icons/map/ic_heart_map_point.svg',
    iconSize: [64, 64],
    iconAnchor: [32, 58],
    popupAnchor: [-3, -76]
});

const stationIcon = new L.Icon({
    iconUrl: '/assets/icons/map/ic_station_map_point.svg',
    iconSize: [64, 64],
    iconAnchor: [32, 58],
    popupAnchor: [-3, -76]
});

const campaignIcon = new L.Icon({
    iconUrl: '/assets/icons/map/ic_campaign_map_point.svg',
    iconSize: [64, 64],
    iconAnchor: [32, 58],
    popupAnchor: [-3, -76]
});

// ----------------------------------------------------------------------

export default {
    heartIcon,
    stationIcon,
    campaignIcon
};
import L from 'leaflet';

// ----------------------------------------------------------------------

const heartIcon = new L.Icon({
    iconUrl: '/assets/icons/map/heart_map_point.svg',
    iconSize: [64, 64],
    iconAnchor: [32, 58],
    popupAnchor: [-3, -76]
})

// ----------------------------------------------------------------------

export default {
    heartIcon
};
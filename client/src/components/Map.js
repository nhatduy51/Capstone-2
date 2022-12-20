import React from 'react'
import GoogleMapReact from 'google-map-react';
import icons from '../ultils/icons';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

const Position = ({ icon }) => <div className='flex flex-col item-center gap-1'>{icon}</div>;
const { HiLocationMarker } = icons;

const Map = ({ address }) => {

  const [coords, setCoords] = React.useState(null);

  React.useEffect(() => {

    const getCoords = async () => {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      setCoords(latLng)
    }
    address ? getCoords() : navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoords({ lat: latitude, lng: longitude })
    });

  }, [address]);

  return (
    <div className='h-[300px] w-full relative'>
      {
        address && <div className='absolute top-[8px] left-[8px] z-50 max-w-[200px] bg-white shadow-md p-4 text-xs'>
          {address}
        </div>
      }
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_API }}
        defaultCenter={coords}
        defaultZoom={11}
        center={coords}
      >
        <Position
          lat={coords?.lat}
          lng={coords?.lng}
          icon={<HiLocationMarker color="red" size={24} />}
        />
      </GoogleMapReact>
    </div>
  )
}
export default React.memo(Map);

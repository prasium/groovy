import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useGetSongsByCountryQuery } from '../redux/services/shazamCore';

const CountryTracks = () => {
  const [country, setCountry] = useState('IN');
  const [countryData, setCountryData] = useState({});
  const [loading, setLoading] = useState(true);
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetSongsByCountryQuery(country);
  useEffect(() => {
    if (!loading) {
      axios
        .get(
          `https://api.geoapify.com/v1/ipinfo?&apiKey=${
            import.meta.env.VITE_GEO_API_KEY
          }`
        )
        .then((res) => {
          console.log('bro>');
          setCountry(res?.data?.country?.iso_code);
          setCountryData(res?.data);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  }, []);

  if (isFetching && loading)
    return <Loader title="Loading Songs around you..." />;

  if (error && country !== '') return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Around you in
        <span className="font-black">
          {' '}
          {countryData?.country?.name ?? 'India'}
        </span>
      </h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data?.map((song, i) => (
          <SongCard
            key={song.key}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default CountryTracks;

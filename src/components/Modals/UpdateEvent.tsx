// export default UpdateMovie;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface CastMember {
  name: string;
  role: string;
}

interface EventData {
  id: string;
  name: string;
  description: string;
  eventType: string;
  artist: string;
  eventDate: string;
  eventImage: string;
  bannerImage: string;
  advImage: string;
  address: string;
  state: string;
  city: string;
  venue: string;
  genre: [];
  language: [];
  eventCategory: string;
  isBanner: boolean;
  isAds: boolean;
}

interface ModalformProps {
  EventData: EventData | null; // Pass existing data for updates
  onSubmitSuccess?: (data: any) => void;
}

const UpdateEvent: React.FC<{
  eventId: string;
  onClose: () => void;
  onSubmitSuccess?: (updatedData: any) => void;
}> = ({ eventId, onSubmitSuccess, onClose }) => {
  const currentUser = useSelector((state: any) => state.user.currentUser?.data);
  const [eventData, setEventData] = useState<EventData | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [eventType, setEventType] = useState('');
  const [artist, setArtist] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [advImage, setAdvImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  // const [castImages, setCastImages] = useState<File[]>([]);
  const [existingEventImage, setExistingEventImage] = useState('');
  const [existingAdvImage, setExistingAdvImage] = useState('');
  const [existingBannerImage, setExistingBannerImage] = useState('');
  // const [existingCastImages, setExistingCastImages] = useState<string[]>([]);

  const [states, setStates] = useState<{ _id: string; name: string }[]>([]); // To store States from API
  const [selectedStateId, setSelectedStateId] = useState<string>(''); // Store selected state's ID

  const [cities, setCities] = useState<{ _id: string; name: string }[]>([]); // To store City from API
  const [selectedCityId, setSelectedCityId] = useState<string>(''); // Store selected city's ID

  const [venues, setVenues] = useState<{ _id: string; name: string }[]>([]); // To store City from API
  const [selectedVenueId, setSelectedVenueId] = useState<string>(''); // Store selected city's ID

  const [isBanner, setIsBanner] = useState(false);
  const [isAds, setIsAds] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formatUTCDate = (date: string | Date) => {
    try {
      const utcDate = new Date(date); // Parse the UTC date string

      // Adjust the date to your desired local timezone (in this case Asia/Kolkata)
      const localDate = new Date(
        utcDate.getTime() + utcDate.getTimezoneOffset() * 60000,
      );

      // Format the local date to "yyyy-MM-dd HH:mm"
      return format(localDate, 'yyyy-MM-dd HH:mm');
    } catch (error) {
      console.error('Error formatting time:', error);
      return ''; // Return an empty string in case of an error
    }
  };

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await axios.post(
          `${Urls.getEventDetail}`,
          { eventId: eventId },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          },
        );

        const data = response.data.data;
        // console.log("data.state",data.state._id);
        setEventData(data);

        // Set state with fetched data
        setName(data.name);
        setDescription(data.description);
        setAddress(data.address);
        setEventType(data.eventType);
        setArtist(data.artist);
        setEventDate(formatUTCDate(data.eventDate));
        setEventCategory(data.eventCategory);
        setSelectedStateId(data.state._id);
        setSelectedCityId(data.city._id);
        setSelectedVenueId(data.venue);
        setGenres(data.genre);
        setLanguages(data.language);
        setExistingEventImage(data.eventImage || '');
        setExistingBannerImage(data.bannerImage || '');
        setExistingAdvImage(data.advImage || '');
        setIsBanner(data.isBanner);
        setIsAds(data.isAds);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    // console.log("State ID:",selectedStateId);

    const fetchStates = async () => {
      try {
        const response = await axios.get(`${Urls.getStatesList}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }); // Replace with your API endpoint
        // console.log("State",response.data.data)
        setStates(response.data.data); // Assuming the response returns an array of roles
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    fetchMovieData();
    //  console.log("selectedStateId",selectedStateId);
    fetchStates();

    fetchVenues(eventType);
  }, [eventId, currentUser.token]);

  useEffect(() => {
    if (selectedStateId) {
      fetchCities(selectedStateId); // Fetch cities for the selected state
    }
  }, [selectedStateId]); // Runs when selectedStateId updates

  useEffect(() => {
    if (eventType) {
      fetchVenues(eventType); // Fetch venue
    }
  }, [eventType]); // Runs when eventType updates

  const fetchVenues = async (eventType: string) => {
    try {
      const response = await axios.get(
        `${Urls.displayVenueList}?type=${eventType}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      ); // Replace with your API endpoint
      console.log('Venue', response.data.data);
      setVenues(response.data.data); // Assuming the response returns an array of roles
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchCities = async (selectedStateId: string) => {
    try {
      const response = await axios.post(
        `${Urls.getCitiesListByState}`,
        { state: selectedStateId },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      ); // Replace with your API endpoint
      // console.log("City",response.data.data)
      setCities(response.data.data); // Assuming the response returns an array of roles
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleAddGenre = () => setGenres([...genres, '']);
  //const handleAddFormat = () => setFormats([...formats, '']);
  const handleAddLanguage = () => setLanguages([...languages, '']);
  // const handleAddCast = () => setCast([...cast, { name: '', role: '' }]);
  const handleBannerChange = () => {
    setIsBanner(!isBanner);
  };
  const handleAdsChange = () => {
    setIsAds(!isAds);
  };

  const handleEventTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const eventType = event.target.value;
    // console.log("eventType",eventType);
    setEventType(eventType);
    fetchVenues(eventType);
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStateId = event.target.value;
    // console.log("selectedStateId",selectedStateId);
    fetchCities(selectedStateId);
    setSelectedStateId(selectedStateId);
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCityId = event.target.value;
    //  console.log("selectedCityId",selectedCityId);
    setSelectedCityId(selectedCityId);
  };

  const handleVenueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVenueId = event.target.value;
    // console.log("selectedVenueId",selectedVenueId);
    setSelectedVenueId(selectedVenueId);
  };

  const now = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(now.getFullYear() + 1);

  // Format to "YYYY-MM-DDTHH:mm"
  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const minDateTime = formatDateTimeLocal(now);
  const maxDateTime = formatDateTimeLocal(nextYear);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error('Please enter the event name.');
      return;
    }

    if (!description) {
      toast.error('Please enter the event description.');
      return;
    }

    if (!eventType) {
      toast.error('Please select the event type.');
      return;
    }

    if (!artist) {
      toast.error('Please enter the artist name.');
      return;
    }

    if (!eventDate) {
      toast.error('Please select the event date.');
      return;
    }

    if (genres.length === 0) {
      toast.error('Please enter at least one genre.');
      return;
    }

    if (languages.length === 0) {
      toast.error('Please enter at least one language.');
      return;
    }

    if (!address) {
      toast.error('Please enter the address.');
      return;
    }

    if (!selectedStateId) {
      toast.error('Please select the state.');
      return;
    }

    if (!selectedCityId) {
      toast.error('Please select the city.');
      return;
    }

    if (!eventCategory) {
      toast.error('Please enter the event category.');
      return;
    }

    if (!selectedVenueId) {
      toast.error('Please select the venue.');
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append('eventId', eventId);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('eventType', eventType);
    formData.append('artist', artist);
    formData.append('eventDate', eventDate);
    formData.append('eventImage', eventImage as Blob);
    formData.append('bannerImage', bannerImage as Blob);
    formData.append('advImage', advImage as Blob);
    formData.append('address', address);
    formData.append('state', selectedStateId);
    formData.append('city', selectedCityId);
    formData.append('venue', selectedVenueId);
    genres.forEach((genre) => formData.append('genre[]', genre));
    languages.forEach((language) => formData.append('language[]', language));
    formData.append('eventCategory', eventCategory);
    formData.append('isBanner', isBanner ? 'true' : 'false');
    formData.append('isAds', isAds ? 'true' : 'false');

    try {
      const response = await axios.post(`${Urls.updateEvent}`, formData, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Event data updated successfully!');

      if (onSubmitSuccess) {
        onSubmitSuccess(response.data);
      }
      onClose();
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        'Oops! Something went wrong while updating the event. Please try again later.';

      toast.error(errorMessage);
    } finally {
      setIsLoading(false); // Set loading to false after the request is completed
    }
  };

  if (!eventData) {
    return (
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-999"
      >
        <div className="w-64 h-64 bg-white p-6 rounded-lg shadow-xl flex flex-col items-center justify-center space-y-4">
          {/* Loader */}
          <div className="animate-spin rounded-full border-t-4 border-blue-500 w-24 h-24 border-b-4 border-gray-200"></div>
          <p className="text-xl text-gray-700 font-semibold">
            Loading event data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-gray-800 flex items-center justify-center bg-black bg-opacity-50 z-999"
    >
      <form
        onSubmit={handleFormSubmit}
        onClick={(e) => e.stopPropagation()}
        className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6 w-full max-w-3xl space-y-4 max-h-[85vh] overflow-y-scroll transform translate-x-30"
      >
        <h2 className="text-xl font-bold">Update Event</h2>

        {/* Movie Fields */}
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input
            type="text"
            placeholder="Enter event name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2 border-stroke bg-transparent py-3 px-5 outline-none transition dark:border-form-strokedark dark:bg-form-input"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            value={description}
            placeholder="Enter description"
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2 border-stroke bg-transparent py-3 px-5 outline-none transition dark:border-form-strokedark dark:bg-form-input"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Event Type</label>
          <select
            className="w-full border rounded p-2 border-stroke bg-transparent py-3 px-5 outline-none transition dark:border-form-strokedark dark:bg-form-input"
            value={eventType}
            onChange={handleEventTypeChange}
            // onChange={(e) => setEventType(e.target.value)}
          >
            <option value="" disabled>
              Select Event Type
            </option>
            <option value="nonSitting">Non Sitting</option>
            <option value="sitting">Sitting</option>
          </select>
          {/* {error && (
                    <span className="text-red-500">{error}</span>
                  )} */}
        </div>

        <div>
          <label className="block font-semibold mb-1">Artist</label>
          <input
            type="text"
            placeholder="Enter artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full border rounded p-2 border-stroke bg-transparent py-3 px-5 outline-none transition dark:border-form-strokedark dark:bg-form-input"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Event Date</label>
          <input
            type="datetime-local"
            min={minDateTime}
            max={maxDateTime}
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full border rounded p-2 border-stroke bg-transparent py-3 px-5 outline-none transition dark:border-form-strokedark dark:bg-form-input"
          />
        </div>

        {/* Genres */}
        <div>
          <label className="block font-semibold mb-1">Genres</label>
          {genres.map((genre, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={genre}
                onChange={(e) =>
                  setGenres(
                    genres.map((g, i) => (i === index ? e.target.value : g)),
                  )
                }
                className="w-full border rounded p-2 mb-2"
              />
              <button
                type="button"
                onClick={() => setGenres(genres.filter((_, i) => i !== index))}
                className="h-10 px-3 bg-red-500 text-white"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddGenre}
            className="px-4 py-2 bg-blue-500 text-white"
          >
            Add Genre
          </button>
        </div>

        {/* Languages */}
        <div>
          <label className="block font-semibold mb-1">Languages</label>
          {languages.map((language, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={language}
                onChange={(e) =>
                  setLanguages(
                    languages.map((l, i) => (i === index ? e.target.value : l)),
                  )
                }
                className="w-full border rounded p-2 mb-2"
              />
              <button
                type="button"
                onClick={() =>
                  setLanguages(languages.filter((_, i) => i !== index))
                }
                className="h-10 px-3 bg-red-500 text-white"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddLanguage}
            className="px-4 py-2 bg-blue-500 text-white"
          >
            Add Language
          </button>
        </div>

        {/* Movie Image */}
        <div className="flex flex-col">
          <label className="block font-semibold mb-1">
            Event Image (104 × 123 px)
          </label>
          {/* {existingMovieImage && (
            <img
              src={existingMovieImage}
              alt="Movie"
              className="w-40 h-40 object-cover mb-2"
            />
          )} */}
          <input
            type="file"
            className="w-full border rounded p-2"
            onChange={(e) => setEventImage(e.target.files?.[0] || null)}
            accept="image/*"
          />
        </div>

        {/* Banner Image */}
        <div className="flex flex-col">
          <label className="block font-semibold mb-1">
            Banner Image (345 × 153 px)
          </label>
          {/* {existingMovieImage && (
            <img
              src={existingMovieImage}
              alt="Movie"
              className="w-40 h-40 object-cover mb-2"
            />
          )} */}
          <input
            type="file"
            className="w-full border rounded p-2"
            onChange={(e) => setBannerImage(e.target.files?.[0] || null)}
            accept="image/*"
          />
        </div>

        {/* Adv Image */}
        <div className="flex flex-col">
          <label className="block font-semibold mb-1">
            Adv Image (306 × 485 px)
          </label>
          {/* {existingMovieImage && (
            <img
              src={existingMovieImage}
              alt="Movie"
              className="w-40 h-40 object-cover mb-2"
            />
          )} */}
          <input
            type="file"
            className="w-full border rounded p-2"
            onChange={(e) => setAdvImage(e.target.files?.[0] || null)}
            accept="image/*"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Address</label>
          <input
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded p-2 border-stroke bg-transparent py-3 px-5 outline-none transition dark:border-form-strokedark dark:bg-form-input"
            required
          />
        </div>

        {/* State Details */}
        <div className="mb-4.5">
          <label className="block font-semibold mb-1">Select State</label>
          <select
            id="state"
            value={selectedStateId}
            onChange={handleStateChange}
            className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input `}
          >
            <option value="" disabled className="text-body dark:text-bodydark">
              Select State
            </option>
            {states.map((state) => (
              <option
                key={state._id}
                value={state._id}
                className="text-body dark:text-bodydark capitalize"
              >
                {state.name}
              </option>
            ))}
          </select>
          {/* {error && (
                    <span className="text-red-500">{error}</span>
                  )} */}
        </div>

        {/* Cities Details */}
        <div className="mb-4.5">
          <label className="block font-semibold mb-1">Select City</label>
          <select
            id="city"
            value={selectedCityId}
            onChange={handleCityChange}
            className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input `}
          >
            <option value="" disabled className="text-body dark:text-bodydark">
              Select City
            </option>
            {cities.map((city) => (
              <option
                key={city._id}
                value={city._id}
                className="text-body dark:text-bodydark capitalize"
              >
                {city.name}
              </option>
            ))}
          </select>
          {/* {error && (
                    <span className="text-red-500">{error}</span>
                  )} */}
        </div>

        <div>
          <label className="block font-semibold mb-1">Event Category</label>
          <select
            value={eventCategory}
            onChange={(e) => setEventCategory(e.target.value)}
            className="w-full border rounded p-2 border-stroke bg-transparent py-3 px-5 outline-none transition dark:border-form-strokedark dark:bg-form-input"
          >
            <option value="">Select a category</option>

            <optgroup label="Music">
              <option value="music">Music</option>
            </optgroup>

            <optgroup label="Sports">
              <option value="football">Football</option>
              <option value="cricket">Cricket</option>
              <option value="sports">Other Sports</option>
            </optgroup>

            <optgroup label="Theatre">
              <option value="theatre">Theatre</option>
            </optgroup>

            <optgroup label="Comedy">
              <option value="comedy">Comedy</option>
            </optgroup>

            <optgroup label="Workshops">
              <option value="workshops">Workshops</option>
            </optgroup>

            <optgroup label="Exhibitions">
              <option value="exhibitions">Exhibitions</option>
            </optgroup>

            <optgroup label="Festivals">
              <option value="festivals">Festivals</option>
            </optgroup>

            <optgroup label="Conferences">
              <option value="conferences">Conferences</option>
            </optgroup>

            <optgroup label="Shadi">
              <option value="haldi">Haldi</option>
              <option value="mehndi">Mehndi</option>
              <option value="sagai">Sagai</option>
            </optgroup>

            <optgroup label="Others">
              <option value="others">Others</option>
            </optgroup>
          </select>
        </div>

        <div className="mb-4.5">
          <label className="block font-semibold mb-1">Select Venue</label>
          <select
            id="venue"
            value={selectedVenueId}
            onChange={handleVenueChange}
            className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input `}
          >
            <option value="" disabled className="text-body dark:text-bodydark">
              Select Venue
            </option>
            {venues.map((venue) => (
              <option
                key={venue._id}
                value={venue._id}
                className="text-body dark:text-bodydark capitalize"
              >
                {venue.name}
              </option>
            ))}
          </select>
          {/* {error && (
                    <span className="text-red-500">{error}</span>
                  )} */}
        </div>

        <div className="flex items-center space-x-4">
          {/* First Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="checkbox1"
              checked={isBanner}
              onChange={handleBannerChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
              htmlFor="checkbox1"
              className="text-sm font-medium text-gray-700"
            >
              Banner
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="checkbox2"
              checked={isAds}
              onChange={handleAdsChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
              htmlFor="checkbox2"
              className="text-sm font-medium text-gray-700"
            >
              Ads
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full justify-center rounded bg-slate-300 p-3 font-medium text-black hover:bg-opacity-90"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex w-full justify-center rounded bg-[#865BFF] hover:bg-[#6a48c9] p-3 font-medium text-gray hover:bg-opacity-90"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update'}
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default UpdateEvent;

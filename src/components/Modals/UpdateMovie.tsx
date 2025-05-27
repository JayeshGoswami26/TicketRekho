// export default UpdateMovie;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Urls from '../../networking/app_urls';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

interface CastMember {
  name: string;
  role: string;
}

interface MovieData {
  id: string;
  name: string;
  description: string;
  director: string;
  runtime: string;
  certification: string;
  genres: string[];
  formats: string[];
  languages: string[];
  cast: CastMember[];
  movieImage: string; // Image URL for existing movie image
  bannerImage: string; // Image URL for existing banner image
  advImage: string; // Image URL for existing adv image
  castImages: string[]; // Image URLs for existing cast images
  isBanner: string;
  isAds: string;
  isPopular: string;
  isLatest: string;
  releaseDate: string;
}

interface ModalformProps {
  MovieData: MovieData | null; // Pass existing data for updates
  onSubmitSuccess?: (data: any) => void;
}

const UpdateMovie: React.FC<{
  movieId: string;
  onClose: () => void;
  onSubmitSuccess?: (MovieData: any) => void;
}> = ({ movieId, onSubmitSuccess, onClose }) => {
  const currentUser = useSelector((state: any) => state.user.currentUser?.data);
  const [movieData, setMovieData] = useState<MovieData | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [director, setDirector] = useState('');
  const [runtime, setRuntime] = useState('');
  const [certification, setCertification] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [formats, setFormats] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [movieImage, setMovieImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [advImage, setAdvImage] = useState<File | null>(null);
  const [castImages, setCastImages] = useState<File[]>([]);
  const [existingMovieImage, setExistingMovieImage] = useState('');
  const [existingBannerImage, setExistingBannerImage] = useState('');
  const [existingAdvImage, setExistingAdvImage] = useState('');
  const [existingCastImages, setExistingCastImages] = useState<string[]>([]);
  const [isBanner, setIsBanner] = useState(false);
  const [isAds, setIsAds] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [isLatest, setIsLatest] = useState(false);
  const [releaseDate, setReleaseDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await axios.post(
          `${Urls.getMovieDetails}`,
          { movieId },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          },
        );

        const data = response.data.data;
        console.log();
        setMovieData(data);

        // Set state with fetched data
        setName(data.name);
        setDescription(data.description);
        setDirector(data.director);
        setRuntime(data.runtime);
        setCertification(data.certification);
        setGenres(data.genre);
        setFormats(data.format);
        setLanguages(data.language);
        setCast(data.cast);
        setExistingMovieImage(data.movieImage || '');
        setExistingBannerImage(data.bannerImage || '');
        setExistingAdvImage(data.advImage || '');
        setExistingCastImages(data.castImages || []);
        setIsBanner(data.isBanner);
        setIsAds(data.isAds);
        setIsPopular(data.isPopular);
        setIsLatest(data.isLatest);
        setReleaseDate(formatDate(data.releaseDate));
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchMovieData();
  }, [movieId, currentUser.token]);

  const handleAddGenre = () => setGenres([...genres, '']);
  const handleAddFormat = () => setFormats([...formats, '']);
  const handleAddLanguage = () => setLanguages([...languages, '']);
  const handleAddCast = () => setCast([...cast, { name: '', role: '' }]);
  const handleBannerChange = () => {
    setIsBanner(!isBanner);
  };
  const handleLatestChange = () => {
    setIsLatest(!isLatest);
  };
  const handlePopularChange = () => {
    setIsPopular(!isPopular);
  };
  const handleAdsChange = () => {
    setIsAds(!isAds);
  };

  const handleCastImageChange = (files: FileList | null) => {
    if (files) {
      setCastImages([...castImages, ...Array.from(files)]);
    }
  };

  const handleRemoveCastImage = (index: number) => {
    setCastImages(castImages.filter((_, i) => i !== index));
  };

  const handleRemoveExistingCastImage = (index: number) => {
    setExistingCastImages(existingCastImages.filter((_, i) => i !== index));
  };

  const formatDate = (date: any) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const year = d.getFullYear();

    return `${year}-${month}-${day}`;
  };

  //   const handleFormSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();

  //     const formData = new FormData();
  //     formData.append('id', movieId);
  //     formData.append('name', name);
  //     formData.append('description', description);
  //     formData.append('director', director);
  //     formData.append('runtime', runtime);
  //     formData.append('certification', certification);
  //     genres.forEach((genre) => formData.append('genre[]', genre));
  //     formats.forEach((format) => formData.append('format[]', format));
  //     languages.forEach((language) => formData.append('language[]', language));
  //     formData.append('movieImage', movieImage as Blob);
  //     formData.append('cast', JSON.stringify(cast));
  //     castImages.forEach((file) => formData.append('castImages', file));

  //     try {
  //       const response = await axios.post(`${Urls.updateMovie}`, formData, {
  //         headers: {
  //           Authorization: `Bearer ${currentUser.token}`,
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       });
  //       alert('Movie data updated successfully!');
  //       onClose();
  //     } catch (error) {
  //       console.error('Error updating movie data:', error);
  //       alert('Error updating movie data.');
  //     }
  //   };

  // const handleFormSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const formData = new FormData();
  //   formData.append('id', movieId);
  //   formData.append('name', name);
  //   formData.append('description', description);
  //   formData.append('director', director);
  //   formData.append('runtime', runtime);
  //   formData.append('certification', certification);
  //   genres.forEach((genre) => formData.append('genre[]', genre));
  //   formats.forEach((format) => formData.append('format[]', format));
  //   languages.forEach((language) => formData.append('language[]', language));
  //   formData.append('movieImage', movieImage as Blob);

  //   // Remove 'id' from cast before appending to FormData
  //   const castWithoutId = cast.map(({ id, ...rest }) => rest); // Exclude 'id' from each cast member
  //   formData.append('cast', JSON.stringify(castWithoutId));

  //   castImages.forEach((file) => formData.append('castImages', file));

  //   try {
  //     const response = await axios.post(`${Urls.updateMovie}`, formData, {
  //       headers: {
  //         Authorization: `Bearer ${currentUser.token}`,
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     alert('Movie data updated successfully!');
  //     onClose();
  //   } catch (error) {
  //     console.error('Error updating movie data:', error);
  //     alert('Error updating movie data.');
  //   }
  // };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter the movie name.');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter the movie description.');
      return;
    }

    if (!director.trim()) {
      toast.error('Please enter the director name.');
      return;
    }

    if (!runtime.trim()) {
      toast.error('Please enter the runtime.');
      return;
    }

    if (!certification.trim()) {
      toast.error('Please enter the certification.');
      return;
    }

    if (genres.length === 0 || genres.some((g) => !g.trim())) {
      toast.error('Please enter at least one genre.');
      return;
    }

    if (formats.length === 0 || formats.some((f) => !f.trim())) {
      toast.error('Please select at least one format.');
      return;
    }

    if (languages.length === 0 || languages.some((l) => !l.trim())) {
      toast.error('Please select at least one language.');
      return;
    }

    if (cast.length === 0) {
      toast.error('Please add at least one cast member.');
      return;
    }

    if (!releaseDate) {
      toast.error('Please select the release date.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('id', movieId);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('director', director);
    formData.append('runtime', runtime);
    formData.append('certification', certification);
    genres.forEach((genre) => formData.append('genre[]', genre));
    formats.forEach((format) => formData.append('format[]', format));
    languages.forEach((language) => formData.append('language[]', language));
    formData.append('movieImage', movieImage as Blob);
    formData.append('bannerImage', bannerImage as Blob);
    formData.append('advImage', advImage as Blob);
    formData.append('isBanner', isBanner ? 'true' : 'false');
    formData.append('isAds', isAds ? 'true' : 'false');
    formData.append('isPopular', isPopular ? 'true' : 'false');
    formData.append('isLatest', isLatest ? 'true' : 'false');
    formData.append('releaseDate', releaseDate);

    // Directly append the cast without any id field removal
    if (castImages.length > 0) formData.append('cast', JSON.stringify(cast));

    castImages.forEach((file) => formData.append('castImages', file));

    try {
      const response = await axios.post(`${Urls.updateMovie}`, formData, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Movie updated successfully!');
      if (onSubmitSuccess) {
        onSubmitSuccess(response.data);
      }

      onClose();
    } catch (error: any) {
      console.error('Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        'Oops! Something went wrong while updating the movie. Please try again later.';

      toast.error(errorMessage);
    } finally {
      setIsLoading(false); // Set loading to false after the request is completed
    }
  };

  if (!movieData) {
    return (
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-999"
      >
        <div className="w-64 h-64 bg-white p-6 rounded-lg shadow-xl flex flex-col items-center justify-center space-y-4">
          {/* Loader */}
          <div className="animate-spin rounded-full border-t-4 border-blue-500 w-24 h-24 border-b-4 border-gray-200"></div>
          <p className="text-xl text-gray-700 font-semibold">
            Loading movie data...
          </p>
        </div>
      </div>
    );
  }

  // Function that formate runtime input to HH:MM
  const formatDuration = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);

    let hours = '00';
    let minutes = '00';

    if (cleaned.length <= 2) {
      minutes = cleaned.padStart(2, '0');
    } else {
      hours = cleaned.slice(0, cleaned.length - 2).padStart(2, '0');
      minutes = cleaned.slice(-2).padStart(2, '0');
    }

    return `${hours}hrs : ${minutes}mins`;
  };

  const handleRuntimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRuntime(e.target.value);
  };
  const handleRuntimeBlur = () => {
    const formatted = formatDuration(runtime);
    setRuntime(formatted);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-gray-800 flex items-center justify-center bg-black bg-opacity-50 z-999"
    >
      <form
        onSubmit={handleFormSubmit}
        onClick={(e) => e.stopPropagation()}
        className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6 w-full max-w-3xl space-y-4 max-h-[85vh] overflow-y-scroll transform translate-x-30 translate-y-10"
      >
        <h2 className="text-xl font-bold">Update Movie</h2>

        {/* Movie Fields */}
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2 border-stroke bg-transparent py-3 px-5 outline-none transition dark:border-form-strokedark dark:bg-form-input"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2 border-stroke bg-transparent py-3 px-5 outline-none transition dark:border-form-strokedark dark:bg-form-input"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Director</label>
          <input
            type="text"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            className="w-full border rounded p-2 border-stroke bg-transparent py-3 px-5 outline-none transition dark:border-form-strokedark dark:bg-form-input"
          />
        </div>
        {/* RunTime Field */}

        {/* <div>
          <label className="block font-semibold mb-1">Runtime</label>
          <input
            type="time"
            step="60" // only allow hour & minute, no seconds
            value={runtime}
            onChange={(e) => setRuntime(e.target.value)}
            className="w-full border rounded p-2 border-stroke bg-transparent py-3 px-5 outline-none transition dark:border-form-strokedark dark:bg-form-input"
          />
        </div> */}

        <div>
          <label className="block font-semibold mb-1">Runtime</label>
          <input
            type="text"
            inputMode="numeric"
            // pattern="\d*"
            placeholder="Enter runtime (HH:MM)"
            value={runtime}
            onChange={(e) => handleRuntimeChange(e)}
            onBlur={handleRuntimeBlur}
            className="w-full border rounded p-2 border-stroke bg-transparent py-3 px-5 outline-none transition dark:border-form-strokedark dark:bg-form-input"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Certification</label>
          <select
            value={certification}
            onChange={(e) => setCertification(e.target.value)}
            className="w-full border rounded p-2 border-stroke bg-transparent py-3 px-5 outline-none transition dark:border-form-strokedark dark:bg-form-input"
          >
            <option value="">Select certification</option>
            <option value="U">U</option>
            <option value="A">A</option>
            <option value="U/A">U/A</option>
            <option value="S">S</option>
          </select>
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
                className="h-11 px-3 bg-red-500 text-white"
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

        {/* Formats */}
        <div>
          <label className="block font-semibold mb-1">Formats</label>
          {formats.map((format, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={format}
                onChange={(e) =>
                  setFormats(
                    formats.map((f, i) => (i === index ? e.target.value : f)),
                  )
                }
                className="w-full border rounded p-2 mb-2"
              />
              <button
                type="button"
                onClick={() =>
                  setFormats(formats.filter((_, i) => i !== index))
                }
                className="h-11 px-3 bg-red-500 text-white"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddFormat}
            className="px-4 py-2 bg-blue-500 text-white"
          >
            Add Format
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
                className="h-11 px-3 bg-red-500 text-white"
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

        {/* Cast */}
        <div>
          <label className="block font-semibold mb-1">Cast</label>
          {cast.map((member, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-2 mb-2">
              <input
                type="text"
                placeholder="Name"
                value={member.name}
                onChange={(e) =>
                  setCast(
                    cast.map((c, i) =>
                      i === index ? { ...c, name: e.target.value } : c,
                    ),
                  )
                }
                className="w-full border rounded p-2 mb-2"
              />
              <input
                type="text"
                placeholder="Role"
                value={member.role}
                onChange={(e) =>
                  setCast(
                    cast.map((c, i) =>
                      i === index ? { ...c, role: e.target.value } : c,
                    ),
                  )
                }
                className="w-full border rounded p-2 mb-2"
              />
              <button
                type="button"
                onClick={() => setCast(cast.filter((_, i) => i !== index))}
                className="h-11 px-3 bg-red-500 text-white"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddCast}
            className="px-4 py-2 bg-blue-500 text-white"
          >
            Add Cast Member
          </button>
        </div>

        {/* Cast Images */}
        <div>
          <label className="block font-semibold mb-1">
            Cast Images (104 × 123 px)
          </label>
          <div className="flex flex-wrap gap-2">
            {existingCastImages.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Cast ${index}`}
                  className="w-24 h-24 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingCastImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                >
                  X
                </button>
              </div>
            ))}
            {castImages.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`New Cast ${index}`}
                  className="w-24 h-24 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCastImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            className="w-full border rounded p-2"
            multiple
            onChange={(e) => handleCastImageChange(e.target.files)}
            accept="image/*"
          />
        </div>

        {/* Movie Image */}
        <div className="flex flex-col">
          <label className="block font-semibold mb-1">
            Movie Image (104 × 123 px)
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
            onChange={(e) => setMovieImage(e.target.files?.[0] || null)}
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

        {/* <div className="flex justify-end">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded py-2"
            disabled={isLoading} // Disable the button while loading
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full border-4 border-t-transparent border-blue-600 w-5 h-5"></div>
              </div>
            ) : (
              'Update'
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black font-bold rounded ml-2"
          >
            Cancel
          </button>
        </div> */}

        <div>
          <label className="block font-semibold mb-1">Release Date</label>
          <input
            type="date"
            placeholder="Select release date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="w-full border rounded p-2 border-stroke bg-transparent py-3 px-5 outline-none transition dark:border-form-strokedark dark:bg-form-input"
          />
        </div>

        <div className="flex items-center space-x-4">
          {/* Banner Checkbox */}
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

          {/* Popular Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="checkbox2"
              checked={isPopular}
              onChange={handlePopularChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
              htmlFor="checkbox2"
              className="text-sm font-medium text-gray-700"
            >
              Popular
            </label>
          </div>

          {/* Latest Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="checkbox3"
              checked={isLatest}
              onChange={handleLatestChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
              htmlFor="checkbox3"
              className="text-sm font-medium text-gray-700"
            >
              Latest
            </label>
          </div>

          {/* Latest Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="checkbox4"
              checked={isAds}
              onChange={handleAdsChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
              htmlFor="checkbox4"
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
      </form>
    </div>
  );
};

export default UpdateMovie;

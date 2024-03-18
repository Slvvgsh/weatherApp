import SideBar from "@/components/sidebar";
import { Inter } from "next/font/google";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import WeatherSvg from "@/public/data";
import heavyrain from "../public/HeavyRain-video.svg";
import Drizzlerain from "../public/Drizzle_rain.svg";
import Clearskyvideo from "../public/Clear-sky.svg";
import Mistvideo from "../public/Mist.svg";
import Cloudyvideo from "../public/cloudy_video.svg";
import snowvideo from "../public/snow_video.svg";
import { Weatherbg } from "@/public/data";
const tzlookup = require("tz-lookup");
const timezone = require("timezone");
const toSentenceCase = (str) => {
  if (!str) return "";

  return str.charAt(0).toUpperCase() + str.slice(1);
};

const bg = {
  heavyrain: heavyrain,
  Drizzlerain: Drizzlerain,
  Clearskyvideo: Clearskyvideo,
  Mistvideo: Mistvideo,
  Cloudyvideo: Cloudyvideo,
  snowvideo: snowvideo,
};

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [weather, setWeather] = useState({
    main: { humidity: "", pressure: "" },
    visibility: "",
    wind: { speed: "" },
  });
  const [loading, setLoading] = useState(true);
  const [City_Image, setCity_Image] = useState();
  const [sunRiseSetaqi, setSunriseSetaqi] = useState({
    sunrise: "",
    sunset: "",
    aqi: "",
  });

  const [id, setid] = useState(null);

  function updateWeatherBackground(ids) {
    setid(ids);
  }
  const [Weeklyforecast, setWeeklyforecast] = useState([
    { date: "", id: 0, temp: "" },
  ]);
  const [searchInput, setSearchInput] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toLocaleString()
  );
  const api_id = process.env.NEXT_PUBLIC_WEATHER_APP_API_KEY;
  const app_url = process.env.NEXT_PUBLIC_WEATHER_APP_URL;
  const city_api_id = process.env.NEXT_PUBLIC_WEATHER_CITY_IMAGE_API_KEY;
  const city_api_url = process.env.NEXT_PUBLIC_WEATHER_CITY_URL;
  const Air_quality_url = process.env.NEXT_PUBLIC_WEATHER_AIR_QUALITY_API;
  const Weekly_forecast_url = process.env.NEXT_PUBLIC_WEATHER_WEEKLY_URL;
  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const getCurrentTime = () => {
    setCurrentDateTime(new Date().toLocaleString());
  };

  const getCurrentLocationWeather = async (lat, lon) => {
    setLoading(true);
    getCurrentTime();

    const tzName = tzlookup(lat, lon);

    try {
      const response = await axios.get(
        `${app_url}lat=${lat}&lon=${lon}&appid=${api_id}`
      );
      setWeather(response.data);
      setSearchInput(response.data.name);

      const sunrise = new Date(response.data.sys.sunrise * 1000);
      const sunset = new Date(response.data.sys.sunset * 1000);
      const hours = sunrise.getHours();
      const minutes = sunrise.getMinutes();
      const hoursSet = sunset.getHours();
      const minutesSet = sunset.getMinutes();
      const sunriseTime = `${hours}:${minutes} AM`;
      const sunsetTime = `${hoursSet}:${minutesSet} PM`;

      const cityImageResponse = await axios.get(
        `${city_api_url}query=${response.data.name}&landmarks&orientation=landscape&client_id=${city_api_id}`
      );
      setCity_Image(cityImageResponse.data);
      setLoading(false);
      const AirqualityResponse = await axios.get(
        `${Air_quality_url}lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&appid=${api_id}`
      );
      setSunriseSetaqi({
        sunrise: sunriseTime,
        sunset: sunsetTime,
        aqi: AirqualityResponse.data.list[0].main.aqi,
      });

      const weekly_response = await axios.get(
        `${Weekly_forecast_url}lat=${lat}&lon=${lon}&appid=${api_id}`
      );
      const dates = weekly_response.data.list;
      let dateToWeatherIdMap = [];
      dates.forEach((listData) => {
        const currentDate = listData.dt_txt.split(" ")[0];
        const Temperature = listData.main.temp;
        const FormatedDate = formatDate(currentDate);
        const weatherId = listData.weather[0].id;

        // Check if the date is already present in the array
        const existingEntry = dateToWeatherIdMap.find(
          (entry) => entry.date === FormatedDate
        );

        if (!existingEntry) {
          // If the date is not present, add a new entry to the array
          dateToWeatherIdMap.push({
            date: FormatedDate,
            id: weatherId,
            temp: Temperature,
          });
        }
      });
      setWeeklyforecast(dateToWeatherIdMap);
    } catch (err) {
      console.log(err);
    }
  };

  const getCurrentWeatherOnSearch = async () => {
    setLoading(true);
    getCurrentTime();

    try {
      const response = await axios.get(
        `${app_url}q=${searchInput}&appid=${api_id}`
      );
      setWeather(response.data);
      const sunrise = new Date(response.data.sys.sunrise * 1000);
      const sunset = new Date(response.data.sys.sunset * 1000);
      const hours = sunrise.getHours();
      const minutes = sunrise.getMinutes();
      const hoursSet = sunset.getHours();
      const minutesSet = sunset.getMinutes();
      const sunriseTime = `${hours}:${minutes} AM`; //need to set the correct time for the sunrise and sunset
      const sunSetTime = `${hoursSet}:${minutesSet} PM`;

      const cityImageResponse = await axios.get(
        `${city_api_url}query=${searchInput}&landmarks&orientation=landscape&client_id=${city_api_id}`
      );
      setCity_Image(cityImageResponse.data);
      setLoading(false);
      const AirqualityResponse = await axios.get(
        `${Air_quality_url}lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&appid=${api_id}`
      );
      setSunriseSetaqi({
        sunrise: sunriseTime,
        sunset: sunSetTime,
        aqi: AirqualityResponse.data.list[0].main.aqi,
      });

      const weekly_response = await axios.get(
        `${Weekly_forecast_url}q=${searchInput}&appid=${api_id}`
      );
      const dates = weekly_response.data.list;
      let dateToWeatherIdMap = [];
      dates.forEach((listData) => {
        const currentDate = listData.dt_txt.split(" ")[0];
        const Temperature = listData.main.temp;
        const FormatedDate = formatDate(currentDate);
        const weatherId = listData.weather[0].id;

        // Check if the date is already present in the array
        const existingEntry = dateToWeatherIdMap.find(
          (entry) => entry.date === FormatedDate
        );

        if (!existingEntry) {
          // If the date is not present, add a new entry to the array
          dateToWeatherIdMap.push({
            date: FormatedDate,
            id: weatherId,
            temp: Temperature,
          });
        }
      });
      setWeeklyforecast(dateToWeatherIdMap);
    } catch (err) {
      alert(toSentenceCase(err.response.data.message));
      console.log(err);
    }
  };
  function formatDate(inputDate) {
    const options = { weekday: "short" };
    const date = new Date(inputDate).toLocaleDateString("en-US", options);
    const currentDate = new Date().toLocaleDateString("en-US", options);

    if (date === currentDate) {
      return "Today";
    } else {
      return new Date(inputDate).toLocaleDateString("en-US", options);
    }
  }
  useEffect(() => {
    setLoading(true);

    const intervalId = setInterval(() => {
      getCurrentTime();
    }, 1000);

    
    return () => clearInterval(intervalId);
  }, [api_id, app_url, city_api_id, city_api_url]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          getCurrentLocationWeather(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Error getting location - Please turn on the location or Provide location access to the web browser"
          );
        },
        { timeout: 10000 }
      );
    } else {
      alert("Geolocation is not available in this browser.");
      console.error("Geolocation is not available in this browser.");
    }
  }, []);
  return (
    <>
      <div className="inset-0 fixed h-screen w-screen -z-10">
        <Image
          src={
            bg[
              Weatherbg(
                weather.weather !== undefined &&
                  weather.weather.length > 0 &&
                  weather.weather[0].id
              )
            ]
          }
          height={0}
          width={0}
          alt="bg"
          className="h-full w-full"
        />
      </div>
      <div className="w-screen flex xl:flex-row flex-col gap-6 p-4 h-screen">
        <div className="xl:w-[35.5%] w-full rounded-3xl backdrop-blur-xl bg-black/30">
          <SideBar
            getCurrentWeatherOnSearch={getCurrentWeatherOnSearch}
            weather={weather}
            City_Image={City_Image}
            searchInput={searchInput}
            handleInputChange={handleInputChange}
            loading={loading}
            currentDateTime={currentDateTime}
          />
        </div>
        <main className="flex pb-20 xl:w-[62.5%] w-full h-full">
          <main className="w-full h-full space-y-4">
            <div className="h-[6%] flex items-center text-backdrop-blur-xl text-2xl font-semibold text-black/30 w-full">
              Weekly Forecast
            </div>
            <div className="w-full h-[90%] sm:h-[65%] md:h-[37%] xl:h-[20%] grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-3 grid-cols-2 gap-4">
              {Weeklyforecast.map((weekdata, index) => (
                <div
                  key={index}
                  className="p-2  text-white/80 font-semibold text-backdrop-blur-xl rounded-3xl backdrop-blur-xl flex flex-col items-center justify-evenly bg-black/20"
                >
                  <h1>{weekdata.date}</h1>
                  <div className="h-14 w-14">
                    <WeatherSvg id={weekdata.id} />
                  </div>
                  <h1>{Math.floor(weekdata.temp)}&deg;</h1>
                </div>
              ))}
            </div>
            <h2 className="text-backdrop-blur-xl flex items-center text-2xl font-semibold text-black/30 w-full">
              Current Weather
            </h2>
            <div className="grid h-[55%] md:h-[89%] xl:h-[70%] md:text-sm xl:grid-cols-3 md:grid-cols-2 md:grid-rows-3 gap-8 xl:grid-rows-2">
              <div className="p-2  text-white/80 font-semibold text-backdrop-blur-xl rounded-3xl backdrop-blur-xl flex flex-col items-center justify-evenly bg-black/20">
                <h1 className="py-2 text-2xl font-normal flex justify-center">
                  Air Quality
                </h1>
                <div className="px-1 py-3 flex gap-6">
                  <Image
                    src="./AQI_2.svg"
                    height={80}
                    width={80}
                    alt="aqiIcon"
                  />
                  <div>
                    <p className="py-2 text-2xl font-normal">
                      AQI Index: {sunRiseSetaqi.aqi}
                    </p>
                    <p className="py-2 text-2xl font-normal">
                      {sunRiseSetaqi.aqi === 1
                        ? "Good"
                        : sunRiseSetaqi.aqi === 2
                        ? "Fair"
                        : sunRiseSetaqi.aqi === 3
                        ? "Moderate"
                        : sunRiseSetaqi.aqi === 4
                        ? "Poor"
                        : sunRiseSetaqi.aqi === 5
                        ? "Very Poor"
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-2  text-white/80 font-semibold text-backdrop-blur-xl rounded-3xl backdrop-blur-xl flex flex-col items-center justify-evenly bg-black/20">
                <h1 className="py-2 text-2xl font-normal flex justify-center">
                  Sunrise & Sunset
                </h1>
                <div className="px-4 py-3 flex">
                  <div className="flex flex-col gap-4">
                    <Image
                      src="./sunrise-and-up-arrow-16478.svg"
                      height={60}
                      width={60}
                      alt="sunriseIcon"
                    />
                    <Image
                      src="./sunset-and-down-arrow-16479.svg"
                      height={60}
                      width={60}
                      alt="sunriseIcon"
                    />
                  </div>
                  <div>
                    <p className=" px-4 py-3 text-2xl font-normal">
                      {sunRiseSetaqi.sunrise}
                    </p>
                    <p className="px-3 py-6 text-2xl font-normal">
                      {sunRiseSetaqi.sunset}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-2  text-white/80 font-semibold text-backdrop-blur-xl rounded-3xl backdrop-blur-xl flex flex-col items-center justify-evenly bg-black/20">
                <h1 className="py-2 text-2xl font-normal flex justify-center">
                  Visibility
                </h1>
                <div className="px-4 py-3 flex">
                  <Image
                    src="./Visibility.svg"
                    height={70}
                    width={70}
                    alt="visibilityicon"
                  />
                </div>
                <div className="px-4 py-3">
                  <p className="py-2 text-2xl font-normal">
                    {weather.visibility / 1000} Km
                  </p>
                </div>
              </div>
              <div className="p-2  text-white/80 font-semibold text-backdrop-blur-xl rounded-3xl backdrop-blur-xl flex flex-col items-center justify-evenly bg-black/20">
                <h1 className="py-2 text-2xl font-normal flex justify-center">
                  Humidity
                </h1>
                <div className="px-1 py-1 flex">
                  <Image
                    src="./Humidity.svg"
                    height={70}
                    width={70}
                    alt="Humidicon"
                  />
                </div>
                <div className="px-4 py-3">
                  <p className="py-2 text-2xl font-normal">
                    {weather.main.humidity} %
                  </p>
                </div>
              </div>
              <div className="p-2  text-white/80 font-semibold text-backdrop-blur-xl rounded-3xl backdrop-blur-xl flex flex-col items-center justify-evenly bg-black/20">
                <h1 className="py-2 text-2xl font-normal flex justify-center">
                  Pressure
                </h1>
                <div className="px-1 py-1 flex">
                  <Image
                    src="./Pressure.svg"
                    height={70}
                    width={70}
                    alt="PressureIcon"
                  />
                </div>
                <div className="px-4 py-3">
                  <p className="py-2 text-2xl font-normal">
                    {weather.main.pressure} hPa
                  </p>
                </div>
              </div>
              <div className="p-2  text-white/80 font-semibold text-backdrop-blur-xl rounded-3xl backdrop-blur-xl flex flex-col items-center justify-evenly bg-black/20">
                <h1 className="py-2 text-2xl font-normal flex justify-center">
                  Wind Status
                </h1>
                <div className="px-1 py-1 flex">
                  <Image
                    src="./Windstatus.svg"
                    height={70}
                    width={70}
                    alt="WindIcon"
                  />
                </div>
                <div className="px-4 py-3">
                  <p className="py-2 text-2xl font-normal">
                    {" "}
                    {weather.wind.speed} m/s{" "}
                  </p>
                </div>
              </div>
            </div>
          </main>
        </main>
      </div>
    </>
  );
}

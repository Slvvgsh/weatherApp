import SideBar from "@/components/sidebar";
import { Inter } from "next/font/google";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import WeatherSvg from "@/public/data";
import { Weatherbg } from "@/public/data";

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

    try {
      const response = await axios.get(
        `${app_url}lat=${lat}&lon=${lon}&appid=${api_id}`
      );
      setWeather(response.data);
      setSearchInput(response.data.name);

      /*// const sunriseTimestamp = response.data.sys.sunrise * 1000;
      // const sunsetTimestamp = response.data.sys.sunset * 1000;
      
      // // Create Date objects from the timestamps
      // const sunrise = new Date(sunriseTimestamp);
      // const sunset = new Date(sunsetTimestamp);
      
      // // Get the current date and time in the system's timezone
      // const currentDate = new Date();
      // const systemTimezoneOffset = currentDate.getTimezoneOffset() / 60; // in hours
      
      // // Convert sunrise and sunset times to GMT
      // const sunriseGMT = new Date(0, 0, 0, sunrise.getUTCHours(), sunrise.getUTCMinutes() - systemTimezoneOffset, 0);
      // const sunsetGMT = new Date(0, 0, 0, sunset.getUTCHours(), sunset.getUTCMinutes() - systemTimezoneOffset, 0);
      
      // // Adjust times to the current location of the system
      // const sunriseLocal = new Date(sunriseGMT.getTime() + (systemTimezoneOffset * 60 * 60 * 1000));
      // const sunsetLocal = new Date(sunsetGMT.getTime() + (systemTimezoneOffset * 60 * 60 * 1000));
      
      // // Format the times as AM/PM
      // const formatTime = (time) => `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}`;
      
      // const sunriseTime = `${formatTime(sunriseLocal)} AM`;
      // const sunsetTime = `${formatTime(sunsetLocal)} PM`;
      
      // console.log("Sunrise Time:", sunriseTime);
      // console.log("Sunset Time:", sunsetTime);*/

      const sunrise = new Date(response.data.sys.sunrise * 1000);
      const sunset = new Date(response.data.sys.sunset * 1000);
      const hours = sunrise.getHours();
      const minutes = sunrise.getMinutes();
      const hoursSet = sunset.getHours();
      const minutesSet = sunset.getMinutes();
      const sunriseTime = `${hours}:${minutes} AM`; //need to set the correct time for the sunrise and sunset
      const sunSetTime = `${hoursSet}:${minutesSet} PM`;

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
        sunset: sunSetTime,
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
    }, 1000); // Fetch time every second

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [api_id, app_url, city_api_id, city_api_url]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(latitude, longitude);
          getCurrentLocationWeather(latitude, longitude);
          // clockIn({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert('Error getting location')
        },
        { timeout: 10000 }
      );
    } else {
      alert('Geolocation is not available in this browser.')
      console.error("Geolocation is not available in this browser.");
    }
  }, []);
  return (
    <>
      <div className="inset-0 fixed h-screen w-screen -z-10">
        <Image
        src = "/cloudy_video.svg"
          height={0}
          width={0}
          // src={`/${Weatherbg(
          //   weather.weather !== undefined &&
          //     weather.weather.length > 0 &&
          //     weather.weather[0].id
          // )}`}
          alt="bg"
          className="h-full w-full"
        />
        {/* <Image
          src={`/${Weatherbg(
            weather.weather !== undefined &&
              weather.weather.length > 0 &&
              weather.weather[0].id
          )}`}
          alt="bg"
          height={1090}
          width={1090}
        /> */}
      </div>
      {/* <div
        className={`w-screen flex gap-4 p-4 h-screen bg-[url(/${Weatherbg(
          weather.weather !== undefined &&
            weather.weather.length > 0 &&
            weather.weather[0].id
        )})] bg-cover bg-no-repeat`}
      > */}
      <div></div>
      <div className="w-screen flex lg:flex-row flex-col gap-4 p-4 h-screen">
        <div className="lg:w-[37.5%] w-full rounded-3xl backdrop-blur-xl bg-black/30">
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
        <main className="flex lg:w-[62.5%] w-full h-full">
          <main className="w-full h-full space-y-4">
            <div className="h-[8%] flex items-center text-backdrop-blur-xl text-2xl font-semibold text-black/30 w-full">
              Weekly Forecast
            </div>
            <div className="w-full h-[60%] sm:h-[29%] md:h-[20%] grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-4">
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
            <h2 className="text-backdrop-blur-xl h-[8%] flex items-center text-2xl font-semibold text-black/30 w-full">
              Current Weather
            </h2>
            <div className="grid h-[55%] xl:grid-cols-3 md:grid-cols-2 md:grid-rows-3 gap-8 xl:grid-rows-2">
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
                  <div class name="flex flex col items-center">
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
                  <div class name="flex flex col items-center">
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

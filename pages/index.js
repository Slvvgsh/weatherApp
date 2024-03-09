import SideBar from "@/components/sidebar";
import { Inter } from "next/font/google";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

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
  const [searchInput, setSearchInput] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toLocaleString()
  );
  const api_id = process.env.NEXT_PUBLIC_WEATHER_APP_API_KEY;
  const app_url = process.env.NEXT_PUBLIC_WEATHER_APP_URL;
  const city_api_id = process.env.NEXT_PUBLIC_WEATHER_CITY_IMAGE_API_KEY;
  const city_api_url = process.env.NEXT_PUBLIC_WEATHER_CITY_URL;
  const Air_quality_url = process.env.NEXT_PUBLIC_WEATHER_AIR_QUALITY_API;
  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const getCurrentTime = () => {
    setCurrentDateTime(new Date().toLocaleString());
  };

  const getCurrentWeatherOnSearch = async () => {
    setLoading(true);
    getCurrentTime(); // Update the time immediately when the search is initiated

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
      const sunriseTime = `${hours}:${minutes} AM`;
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
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setLoading(true);

    const intervalId = setInterval(() => {
      getCurrentTime();
    }, 1000); // Fetch time every second

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [api_id, app_url, city_api_id, city_api_url]);
  return (
    <div className="w-screen flex gap-4 p-4 h-screen bg-[url(/fhg.svg)] bg-cover bg-no-repeat">
      <div className="w-[37.5%] rounded-3xl backdrop-blur-xl bg-black/30">
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
      <main className="flex w-[62.5%] h-full">
        <main className="w-full h-full space-y-4">
          <div className="h-[8%] flex items-center text-backdrop-blur-xl text-2xl font-semibold text-white/60 w-full">
            Today
          </div>
          <div className="w-full h-[20%] grid grid-cols-6 gap-4">
            <div className="p-2  text-white/80 font-semibold text-backdrop-blur-xl rounded-3xl backdrop-blur-xl flex flex-col items-center justify-evenly bg-black/20">
              <h1>06:00 PM</h1>
              <Image src="/clear-night.svg" alt="ng" height="50" width="50" />
              <h1>15&deg;</h1>
            </div>

            <div className="p-2  text-white/80 font-semibold text-backdrop-blur-xl rounded-3xl backdrop-blur-xl flex flex-col items-center justify-evenly bg-black/20">
              <h1>06:00 PM</h1>
              <Image src="/clear-night.svg" alt="ng" height="50" width="50" />
              <h1>15&deg;</h1>
            </div>

            <div className="p-2  text-white/80 font-semibold text-backdrop-blur-xl rounded-3xl backdrop-blur-xl flex flex-col items-center justify-evenly bg-black/20">
              <h1>06:00 PM</h1>
              <Image src="/clear-night.svg" alt="ng" height="50" width="50" />
              <h1>15&deg;</h1>
            </div>

            <div className="p-2  text-white/80 font-semibold text-backdrop-blur-xl rounded-3xl backdrop-blur-xl flex flex-col items-center justify-evenly bg-black/20">
              <h1>06:00 PM</h1>
              <Image src="/clear-night.svg" alt="ng" height="50" width="50" />
              <h1>15&deg;</h1>
            </div>

            <div className="p-2  text-white/80 font-semibold text-backdrop-blur-xl rounded-3xl backdrop-blur-xl flex flex-col items-center justify-evenly bg-black/20">
              <h1>06:00 PM</h1>
              <Image src="/clear-night.svg" alt="ng" height="50" width="50" />
              <h1>15&deg;</h1>
            </div>

            <div className="p-2  text-white/80 font-semibold text-backdrop-blur-xl rounded-3xl backdrop-blur-xl flex flex-col items-center justify-evenly  bg-black/20">
              <h1>06:00 PM</h1>
              <Image src="/clear-night.svg" alt="ng" height="50" width="50" />
              <h1>15&deg;</h1>
            </div>
          </div>
          <h2 className="text-backdrop-blur-xl h-[8%] flex items-center text-2xl font-semibold text-white/60 w-full">
            Current Weather
          </h2>
          <div className="grid h-[55%] grid-cols-3 gap-8 grid-rows-2">
            <div className="p-2  text-white/80 font-semibold text-backdrop-blur-xl rounded-3xl backdrop-blur-xl flex flex-col items-center justify-evenly bg-black/20">
              <h1 className="py-2 text-2xl font-normal flex justify-center">
                Air Quality
              </h1>
              <div className="px-4 py-3">
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
            <div className="p-2  text-white/80 font-semibold text-backdrop-blur-xl rounded-3xl backdrop-blur-xl flex flex-col items-center justify-evenly bg-black/20">
              <h1 className="py-2 text-2xl font-normal flex justify-center">
                Sunrise & Sunset
              </h1>
              <div className="px-4 py-3">
                <p className="py-2 text-2xl font-normal">
                  {sunRiseSetaqi.sunrise}
                </p>
                <p className="py-2 text-2xl font-normal">
                  {sunRiseSetaqi.sunset}
                </p>
              </div>
            </div>
            <div className="p-2  text-white/80 font-semibold text-backdrop-blur-xl rounded-3xl backdrop-blur-xl flex flex-col items-center justify-evenly bg-black/20">
              <h1 className="py-2 text-2xl font-normal flex justify-center">
                Visibility
              </h1>
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
  );
}

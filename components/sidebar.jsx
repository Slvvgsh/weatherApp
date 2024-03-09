import Image from "next/image";
import WeatherSvg from "@/public/data";

export default function SideBar({getCurrentWeatherOnSearch,weather,City_Image,searchInput,handleInputChange,loading,currentDateTime}) {

  return (
      <div className="p-4 w-full space-y-4 flex flex-col items-center">
        <form onSubmit={()=>getCurrentWeatherOnSearch()} className="w-full relative">
          <input
            placeholder="search for cities..."
            className="bg-gray-100 w-full px-4 p-1 h-10 text-sm rounded-lg focus:outline-none ring-0"
            value={searchInput}
            onChange={(e)=>handleInputChange(e)}
          />
          <button type="submit" onClick={(e)=>{e.preventDefault();getCurrentWeatherOnSearch()}} className="inline-flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 absolute right-3 top-[30%]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          </button>
        </form>
        {!loading && (<div className="w-full flex justify-between items-center">
          {" "}
          <div className=" h-56 w-56">
            <WeatherSvg id={weather.weather[0].id}/>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <div className="flex text-6xl text-cyan-100">
              <h1 className="text-9xl">{weather.main.temp.toFixed(0)}</h1>&deg;
              <span className="text-6xl text-start">C</span>
              <div className="flex justify-between w-fit px-12 py-1 gap-16 items-center"></div>
            </div>
          </div>
        </div> )}
        {!loading && (<div className="flex flex-col gap-4 items-center justify-center w-full">
          <h1 className="text-2xl gap-3 text-cyan-100">
            {currentDateTime}
          </h1>
          <div className="relative w-full">
            <hr className="my-10 border-t-4 border-cyan-100" />
            <Image
              className="mix-blend-overlay w-full rounded-lg h-[295px]"
              src={City_Image.urls.full}
              alt="icon"
              height="500"
              width="500"
            />
            <h3 className="text-3xl absolute bottom-0 right-0 p-4 text-gray-300">
              {weather.name} , {weather.sys.country}
            </h3>
          </div>
        </div>)}
      </div>
   
  );
}

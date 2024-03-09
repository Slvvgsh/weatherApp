import Image from "next/image";
import next from "./clear-day.svg";
import {Thunderstorm, Drizzle_rain, HeavyRain, HeavySnow, Mist, ClearSky, CLoudyFewClouds } from "@/components/svg";

export default function WeatherSvg({ id }) {
  switch (id) {
    //200,201,202,210,212,221,230,231,232 Thunderstorm
    case 200:
    case 202:
    case 210:
    case 212:
    case 221:
    case 230:
    case 231:
    case 232:
      return <Thunderstorm />;
    //300,301,302,310,311,312,313,314,321,520,521,522,531 Drizzle and Rain
    case 300:
    case 301:
    case 302:
    case 310:
    case 311:
    case 312:
    case 313:
    case 314:
    case 321:
    case 520:
    case 521:
    case 522:
    case 531:
      return <Drizzle_rain />;
    //500,501,502,503,504 Light rain to heavy rain
    case 500:
    case 501:
    case 502:
    case 503:
    case 504:
        return <HeavyRain />;
    //511,600,601,602,611,612,613,615,616,620,621,622
    case 511:
    case 600:
    case 601:
    case 602:
    case 611:
    case 612:
    case 613:
    case 615:
    case 616:
    case 620:
    case 621:
    case 622:
        return <HeavySnow/>;
    //701,711,721,731,741,751,761,762,771,781
    case 701:
    case 711:
    case 721:
    case 731:
    case 741:
    case 751:
    case 761:
    case 762:
    case 771:
    case 781:
        return <Mist/>
    case 800:
        return <ClearSky/>
    case 801:
    case 802:
    case 803:
    case 804:
        return <CLoudyFewClouds/>
    default:
      break;
  }
}

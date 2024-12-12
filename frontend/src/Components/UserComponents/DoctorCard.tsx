

import { LuBadgeCheck } from "react-icons/lu";

interface Doctor {
  name: string;
  specialty: string;
  url: string;
}

export default function DoctorCard({ name, specialty, url }: Doctor) {
  return (
    <div className="w-64 h-80 text-white shadow-lg rounded-md relative overflow-hidden cursor-pointer font-sans">
      {/* Certified badge */}
      <div className="absolute top-2 left-2 flex items-center space-x-1 ">
        <LuBadgeCheck className="text-3xl fill-blue-600" size={40} />{" "}
        {/* React Icon for the badge */}
        {/* <span className="text-sm font-semibold text-blue-600">Certified</span> */}
      </div>

      {/* Doctor Image */}
      <img
        src={url}
        className="rounded-md object-cover w-full h-full"
        alt={name}
      />

      {/* Doctor Details */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
        <p className="font-bold text-3xl pr-36">{name}</p>
        <p className="text-md pr-36">{specialty}</p>
      </div>
    </div>
  );
}

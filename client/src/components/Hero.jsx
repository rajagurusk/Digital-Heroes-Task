import { FaChartLine } from "react-icons/fa";

function HeroPanel() {
  return (
    <div className="relative flex flex-col justify-end rounded-l-3xl overflow-hidden bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-700 p-12 min-h-[750px]">

      {/* Decorative circles */}
      <div className="absolute -top-32 -left-20 w-80 h-80 rounded-full bg-white/10 blur-sm"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/10"></div>

      <div className="relative z-10">

        <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 backdrop-blur">
          <FaChartLine className="text-white text-3xl"/>
        </div>

        <h1 className="text-6xl font-bold text-white leading-tight">

          Capture.<br/>

          Manage.<br/>

          Convert.

        </h1>

        <p className="mt-6 text-white/90 text-lg max-w-md">

          Transform enquiries into customers using
          our smart Lead Management Platform.

        </p>

      </div>

    </div>
  );
}

export default HeroPanel;
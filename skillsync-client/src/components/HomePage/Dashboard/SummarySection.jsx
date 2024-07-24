import { FaFileAlt, FaFlag, FaSave } from "react-icons/fa";
import { BsFillSendFill } from "react-icons/bs";

// Todo: replace with real data
const stats = [
  {title: "Jobs Saved", value: 0, icon: FaSave},
  {title: "Jobs Applied", value: 0, icon: BsFillSendFill},
  {title: "Job Offers", value: 0, icon: FaFlag},
  {title: "Resumes", value: 0, icon: FaFileAlt},
]

const SummarySection = ({}) => {
  return (
    <div className="flex flex-row space-x-3 text-white">
      {stats.map((stat) => (
        <div key={stat.title} className="flex flex-row items-center space-x-4 p-5 bg-[#1e1e1e] rounded-lg border border-2 border-cyan-700">
          <div className="flex flex-col text-4xl"><stat.icon /></div>
          <div className="flex flex-col text-left">
            <p className="text-xl font-bold text-green-400">{stat.value}</p>
            <p>{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummarySection;
import Construction from "../../assets/Construction.svg";

const ResumeBuilder = () => {
    return (
      <div className="p-3 min-h-screen">
      <h1 className="text-white text-2xl font-bold mb-4">Resume Builder</h1>
      <div className="h-full w-full flex justify-center items-center flex-col">
          <img className="w-1/2 mt-[2%]" src={Construction} alt="Under Construction" />
          <p className="text-white mt-6 text-lg font-medium ml-4">
            This feature is under construction, please check back later. Thanks for waiting!
          </p>
      </div>
      </div>
    );
  };
  
  export default ResumeBuilder;
  
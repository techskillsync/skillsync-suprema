import React, { useCallback, useEffect } from "react";
import Particles from "react-particles";
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.

// @ts-ignore
import LogoDark from "../../assets/LogoDark.png";
import { parseResume } from "../../api/ResumeParser";
import { UpdateJobPreferences } from "../../supabase/JobPreferences";
import { SetProfileInfo } from "../../supabase/ProfileInfo";
import { AddResume } from "../../supabase/Resumes";
import { SaveNewWorkExperience } from "../../supabase/WorkExperience";

const FinishScreen = ({ preferences, page, resumeFile, setPage }) => {
  const [showParticles, setShowParticles] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const particlesInit = useCallback(async (engine) => {
    console.log(engine);
    await loadSlim(engine); // or await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowParticles(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  async function onboardUser() {
    console.log("Onboarding...");
    setLoading(true);
    UpdateJobPreferences({
      desired_culture: preferences.selectedNewRoleOptions,
      location: preferences.location,
      work_authorization: preferences.workAuthorization,
      start_time: preferences.startDate,
      experience_level: preferences.level,
    });
    if (resumeFile) {
      AddResume(resumeFile, "Default Resume - " + preferences.name);
      const resumeData = await parseResume(resumeFile);
      console.log("Parsed resume data:", resumeData);

      SetProfileInfo(resumeData);

      for (let i = 0; i < resumeData.work_experiences.length; i++) {
        const workExperience = resumeData.workExperiences[i];
        console.log("Adding work experience:", workExperience);
        SaveNewWorkExperience(workExperience);
      }
    }
    setLoading(false);
  }

  const handleFinish = async () => {
    console.log(preferences);
    console.log(resumeFile);
    await onboardUser();
    window.location.href = "/home";
  };

  return (
    <div className="w-full h-full relative">
      {showParticles && (
        <Particles
          className="fade-in"
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: "#000000",
              },
            },
            fpsLimit: 60,
            //   interactivity: {
            //     events: {
            //       onClick: {
            //         enable: true,
            //         mode: "push",
            //       },
            //       onHover: {
            //         enable: true,
            //         mode: "repulse",
            //       },
            //       resize: true,
            //     },
            //     modes: {
            //       push: {
            //         quantity: 4,
            //       },
            //       repulse: {
            //         distance: 200,
            //         duration: 0.4,
            //       },
            //     },
            //   },
            particles: {
              color: {
                value: ["35c0f0"],
              },
              links: {
                enable: false,
              },
              collisions: {
                enable: true,
              },
              move: {
                direction: loading ? "top" : "bottom",
                enable: true,
                outMode: "out",
                random: false,
                speed: loading ? 40 : 2,
                straight: loading ? true : false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 100,
              },
              opacity: {
                value: 1,
              },
              shape: {
                type: "circle",
              },
              size: {
                random: true,
                value: 5,
              },
            },
            detectRetina: true,
          }}
        />
      )}
      <div className="relative w-full h-full flex flex-col items-center justify-center pt-12">
        <img src={LogoDark} className="w-52 mt-4" />
        <p className="text-[16px] mt-2 text-center text-lg">
          You're all set! Click finish to complete the setup.
        </p>
        <button
          className="bg-gradient-to-r w-64 text-lg from-blue-500 to-green-500 text-white px-4 py-2 border-none rounded-md mt-4"
          onClick={() => handleFinish()}
          disabled={loading}
        >
          {loading ? "Setting up..." : "Finish"}
        </button>
        <button
          className="
             border-none bg-transparent p-0 mt-4 text-gray-400
          "
          onClick={() => setPage(page - 1)}
        >
          Go back
        </button>
        <button
          onClick={() => {setLoading(!loading)}}
        >
          Test
        </button>
      </div>
    </div>
  );
};

export default FinishScreen;

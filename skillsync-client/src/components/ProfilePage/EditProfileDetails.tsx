import React, { useState, useEffect } from "react";
import supabase from "../../supabase/supabaseClient";
import {
  GetProfileInfo,
  GetUserEmail,
  SetProfileInfo,
} from "../../supabase/ProfileInfo.ts";
import { InputField, SelectField } from "./InputField.tsx";
import universityNames from "../../constants/university_list.js";
import specializations from "../../constants/specialization_list.js";
import programs from "../../constants/program_list.js";
import EditProfilePicture from "./EditProfilePicture.tsx";
import { FaArrowLeft } from "react-icons/fa";

const EditProfileDetails = ({}) => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [school, setSchool] = useState("");
  const [grad_year, setGradYear] = useState("");
  const [program, setProgram] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [industry, setIndustry] = useState("");
  const [linkedin, setLinkedIn] = useState("");
  const [github, setGithub] = useState("");
  const [plumProfile, setPlumProfile] = useState("");
  const [workEligibility, setWorkEligibility] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [gender, setGender] = useState("");
  const [race, setRace] = useState("");

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      setLoading(true);

      const columns = `name, location, school, grad_year, program, specialization, industry, linkedin, github,
					date_of_birth, gender, race`;

      const email = await GetUserEmail();
      if (!email) {
        console.log("Not logged in");
        return;
      }
      const data = await GetProfileInfo(columns);

      if (!data) {
        return;
      }

      if (!ignore) {
        setName(data.name);
        setEmail(email);
        setLocation(data.location);
        setSchool(data.school);
        setGradYear(data.grad_year);
        setProgram(data.program);
        setSpecialization(data.specialization);
        setIndustry(data.industry);
        setLinkedIn(data.linkedin);
        setGithub(data.github);
        setDateOfBirth(data.date_of_birth);
        setGender(data.gender);
        setRace(data.race);
      }
      setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, []);

  async function UpdateProfile(event) {
    event.preventDefault();
    setLoading(true);

    const updates = {
      name,
      location,
      school,
      grad_year,
      program,
      specialization,
      industry,
      linkedin,
      github,
      date_of_birth: dateOfBirth,
      gender,
      race,
    };

    await SetProfileInfo(updates);

    setLoading(false);
  }

  return (
    <form
      onSubmit={UpdateProfile}
      className="form-widget bg-black rounded-md p-6"
    >
      <div className="mb-4">
        {/* <div className="flex space-x-3 items-center mb-4">
          <FaArrowLeft  />
          <h2 className="text-xl font-bold">
            Personal Information
          </h2>
        </div> */}
        <div className="mx-auto pb-4">
          <EditProfilePicture />
          <div key={"Name"} className="text-white w-[300px] mx-auto mt-2">
              <InputField
                id={"Name"}
                item={"Name"}
                value={name}
                type="text"
                required={true}
                onChange={(e) => setName(e.target.value)}
                className="!text-center"
                showLabel={false}
              />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3">
          {[
            // { label: "Name", state: name, setState: setName },
            { label: "Location", state: location, setState: setLocation },
            // { label: "DOB", state: date_of_birth, setState: setDateOfBirth },
            { label: "Ethnicity", state: race, setState: setRace },
            { label: "Gender", state: gender, setState: setGender },
          ].map((item) => (
            <div key={item.label} className="text-white">
              <InputField
                id={item.label}
                item={item.label}
                value={item.state}
                type="text"
                required={true}
                onChange={(e) => item.setState(e.target.value)}
                className=""
              />
            </div>
          ))}
          <div key={"dob"} className="text-white">
            <InputField
              id={"dob"}
              item={"Date of Birth"}
              // @ts-ignore
              value={dateOfBirth}
              type="date"
              required={true}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className=""
            />
          </div>
        </div>
      </div>

      <div className="mb-4 mt-8">
        <h2 className="text-xl font-bold mb-2">School Info</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              label: "School",
              state: school,
              setState: setSchool,
              list: universityNames,
            },
            {
              label: "Graduation Year",
              state: grad_year,
              setState: setGradYear,
              //   Todo: add constant for earliest possible year
              list: Array.from(
                { length: new Date().getFullYear() + 9 - 1950 },
                (_, i) => 1950 + i
              ).reverse(),
            },
            {
              label: "Program",
              state: program,
              setState: setProgram,
              list: programs,
            },
            {
              label: "Specialization",
              state: specialization,
              setState: setSpecialization,
              list: specializations,
            },
          ].map((item) => (
            <div key={item.label}>
              <SelectField
                id={item.label}
                item={item.label}
                list={item.list}
                value={{
                  value: item.state,
                  label: item.state,
                }}
                creatable={true}
                required={true}
                // @ts-ignore
                onChange={(value) => item.setState(value!.value)}
                className="!text-black"
                allowMultiple={false}
                placeholder={undefined}
                showLabel={undefined}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 mt-8">
        <h2 className="text-xl font-bold mb-2">Links</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              label: "GitHub",
              state: github,
              setState: setGithub,
              placeholder: "http://linkedin.com/in/john-doe-123/",
            },
            {
              label: "LinkedIn",
              state: linkedin,
              setState: setLinkedIn,
              placeholder: "http://github.com/JohnDoe123",
            },
          ].map((item) => (
            <div key={item.label}>
              <InputField
                id={item.label}
                item={item.label}
                value={item.state}
                type="text"
                placeholder={item.placeholder}
                required={true}
                onChange={(e) => item.setState(e.target.value)}
                className=""
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button className="button primary" type="submit" disabled={loading}>
          {loading ? "Loading ..." : "Update"}
        </button>

        <button
          className="button"
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/";
          }}
        >
          Sign Out
        </button>
      </div>
    </form>
  );
};

export default EditProfileDetails;

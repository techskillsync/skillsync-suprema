import React from 'react';
import Joyride from 'react-joyride';

export class Tutorial  extends React.Component {
  state = {
    steps: [
      {
        target: '.my-first-step', 
        content: 'This card shows the number of jobs you have saved. Use this to keep track of job opportunities you are interested in.',
        placement: 'bottom'
      },
      {
        target: '.my-second-step',
        content: 'This card displays the number of jobs you have applied to. It helps you track your job applications.',
        placement: 'bottom'
      },
      {
        target: '.my-third-step',
        content: 'This card indicates the number of interviews you have scheduled. Keep an eye on your interview progress here.',
        placement: 'bottom'
      },
      {
        target: '.my-fourth-step', // Job Offers Card
        content: 'This card shows the number of job offers you have received. Celebrate your job offers by tracking them here.',
        placement: 'bottom'
      },
      {
        target: '.my-fifth-step', // Resumes Card
        content: 'This card displays the number of resumes you have created or uploaded. Use it to manage your resumes.',
        placement: 'bottom'
      },
      {
        target: '.my-sixth-step', // Job Search Preferences
        content: 'This section displays your job search preferences such as location, salary range, job modes, keywords, and more. You can edit these preferences by clicking the "Edit" button.',
        placement: 'top'
      },
      {
        target: '.my-seventh-step', // Your Stats Chart
        content: 'This chart provides an overview of your job application statistics, including interview rate, conversion rate, and profile building progress.',
        placement: 'left'
      },
      {
        target: '.my-eighth-step', // Spotlight Jobs Section
        content: 'This section highlights specific job opportunities based on your preferences and profile. Explore these jobs to find suitable opportunities.',
        placement: 'top'
      },
      
    ],
    run: true 
  };

  render() {
    const { steps } = this.state;

    return (
      <div className="app">
        <Joyride
          steps={steps}
          run={true}
          continuous={true} 
          showSkipButton={true}
          showProgress={true}
          styles={{
            options: {
              zIndex: 10000, 
              backgroundColor: '#ffffff',
              textColor: '#333',
              width: 500
            },
            buttonNext: {
                backgroundColor: '#36b7ff',  
                color: '#fff', 
              },
              buttonBack: {
                color: '#36b7ff'  
              },
              buttonSkip: {
                color: '#36b7ff'  
              }
              beacon: {
                inner: '#4CAF50',  // Inner beacon color set to green
                outer: '#A5D6A7',  // Outer beacon color, a lighter shade of green
              }
          }}
          
        />
       
      </div>
    );
  }
}

export default Tutorial;

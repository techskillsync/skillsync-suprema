function base64ToBlob(base64, mime) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
  }
  
  function isVisible(element) {
    return element.offsetWidth > 0 && element.offsetHeight > 0;
  }
  
  function autofillForm(profile) {
    const { resume, coverLetter, profileData } = profile;
  
    const fieldMapping = {
      fullName: ["name", "full_name", "fullname"],
      email: ["email", "email_address", "emailaddress"],
      phone: ["phone", "phone_number", "phonenumber"],
      address: ["address", "home_address", "homeaddress"],
      city: ["city", "home_city", "homecity"],
      state: ["state", "province", "region"],
      zip: ["zip", "zipcode", "postal_code", "postalcode"],
      country: ["country", "nation"]
    };
  
    function findInputField(name) {
      const selectors = [
        `input[name="${name}"]`,
        `textarea[name="${name}"]`,
        `select[name="${name}"]`,
        `input[id="${name}"]`,
        `textarea[id="${name}"]`,
        `select[id="${name}"]`,
        `input[class*="${name}"]`,
        `textarea[class*="${name}"]`,
        `select[class*="${name}"]`,
        `input[placeholder*="${name}"]`,
        `textarea[placeholder*="${name}"]`,
        `select[placeholder*="${name}"]`
      ];
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && isVisible(element)) {
          return element;
        }
      }
      return null;
    }
  
    // Autofill resume (file upload)
    const resumeInput = findInputField("resume");
    if (resumeInput) {
      try {
        const resumeBlob = base64ToBlob(resume.content, resume.mimeType);
        const resumeFile = new File([resumeBlob], resume.filename, { type: resume.mimeType });
        const resumeDataTransfer = new DataTransfer();
        resumeDataTransfer.items.add(resumeFile);
        resumeInput.files = resumeDataTransfer.files;
        const resumeEvent = new Event('change', { bubbles: true });
        resumeInput.dispatchEvent(resumeEvent);
        console.log("Resume uploaded successfully.");
      } catch (error) {
        console.error("Error uploading resume:", error);
      }
    }
  
    // Autofill cover letter (file upload)
    const coverLetterInput = findInputField("coverletter");
    if (coverLetterInput) {
      try {
        const coverLetterBlob = base64ToBlob(coverLetter.content, coverLetter.mimeType);
        const coverLetterFile = new File([coverLetterBlob], coverLetter.filename, { type: coverLetter.mimeType });
        const coverLetterDataTransfer = new DataTransfer();
        coverLetterDataTransfer.items.add(coverLetterFile);
        coverLetterInput.files = coverLetterDataTransfer.files;
        const coverLetterEvent = new Event('change', { bubbles: true });
        coverLetterInput.dispatchEvent(coverLetterEvent);
        console.log("Cover letter uploaded successfully.");
      } catch (error) {
        console.error("Error uploading cover letter:", error);
      }
    }
  
    // Autofill profile information
    for (const [key, value] of Object.entries(profileData)) {
      if (fieldMapping[key]) {
        for (const fieldName of fieldMapping[key]) {
          const input = findInputField(fieldName);
          if (input) {
            try {
              input.value = value;
              const inputEvent = new Event('input', { bubbles: true });
              input.dispatchEvent(inputEvent);
              console.log(`Filled ${key} with value: ${value}`);
              break; // Stop after the first match
            } catch (error) {
              console.error(`Error filling ${key}:`, error);
            }
          }
        }
      }
    }
  }
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'AUTOFILL_FORM') {
      chrome.runtime.sendMessage({ type: 'GET_PROFILE' }, (response) => {
        autofillForm(response);
        sendResponse({ status: 'success' });
      });
    }
    return true;
  });
  
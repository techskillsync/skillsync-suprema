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

async function generateResponse(prompt) {
  const apiKey = 'YOUR_OPENAI_API_KEY';
  const response = await fetch('https://api.openai.com/v1/engines/gpt-4-mini/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt: prompt,
      max_tokens: 150,
      temperature: 0.7
    })
  });
  const data = await response.json();
  return data.choices[0].text.trim();
}

async function autofillFeatheryForm(profile) {
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
            break;
          } catch (error) {
            console.error(`Error filling ${key}:`, error);
          }
        }
      }
    }
  }

  const openEndedQuestions = document.querySelectorAll('textarea');
  for (const question of openEndedQuestions) {
    const questionText = question.getAttribute('placeholder') || question.getAttribute('aria-label') || '';
    const prompt = `Based on the following user data, generate a response to this question: ${questionText}\n\nUser Data: ${JSON.stringify(profileData)}`;
    try {
      const response = await generateResponse(prompt);
      question.value = response;
      const inputEvent = new Event('input', { bubbles: true });
      question.dispatchEvent(inputEvent);
      console.log(`Filled question with response: ${response}`);
    } catch (error) {
      console.error(`Error generating response for question: ${questionText}`, error);
    }
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'AUTOFILL_FORM') {
    chrome.runtime.sendMessage({ type: 'GET_PROFILE' }, (response) => {
      autofillFeatheryForm(response).then(() => {
        sendResponse({ status: 'success' });
      }).catch(error => {
        console.error('Error autofilling the form:', error);
        sendResponse({ status: 'failure', error: error.message });
      });
    });
  }
  return true;
});

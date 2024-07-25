export default async function getGlassDoorRating(companyName) {
    console.log('Company name:', companyName);
    // Scrape Glassdoor for company rating:
    const url = `https://www.glassdoor.com/Search/results.htm?keyword=${companyName}`;
    console.log(url);
  
    // // TODO: Temporary to avoid Too many requests, fix
    // return 'Test rating';
  
    const response = await fetch(
      `https://www.glassdoor.com/Search/results.htm?keyword=${companyName}`,
      { agent: 'SkillSync' }
    );
    const text = await response.text();
    console.log('Glassdoor text', text);
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    // Check if first result company name matches company name exactly
  
    // ! Needs to keep being updated
    // TODO: Update to a more robust selection
    const firstResult = doc.querySelector(
      '[data-test="company-search-results"] a'
    );
    //   const firstResult = doc.querySelector('.company-search-result a');
    console.log('FIrst Glassdoor result for', companyName, ':', firstResult);
  
    if (
      firstResult &&
      firstResult.querySelector('h3').innerText === companyName
    ) {
      const rating = firstResult.querySelector('strong').innerText;
      return rating;
    }
    return null;
  }
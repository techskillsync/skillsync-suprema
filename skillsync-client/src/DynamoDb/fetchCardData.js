import { GetUserId } from '../supabase/GetUserId';
import AWS from './awsConfig.js';

const docClient = new AWS.DynamoDB.DocumentClient();

const jobParams = [
    "Accounting/Finanace",
    "Administrative", 
    "Analyst", 
    "Architecture/Drafting", 
    "Art/Design/Entertainement", 
    "Banking/Loan/Insurance", 
    "Beauty/Wellness", 
    "Business Development/Consulting",
    "Education",
    "Engineering(Non-Software)",
    "Facilities/General Labour",
    "Hospitality",
    "Human Resources",
    "Installation/Maintenance/Repair",
    "Legal",
    "Manufacturing/Production/Construction",
    "Marketing/Advertisement/PR",
    "Medical/Healtcare",
    "Non-Profit/Volunteering",
    "Product/Project Management",
    "Real Estate",
    "Restaurant/Food Service",
    "Retail",
    "Sales/Customer Care",
    "Science/Research",
    "Security/Law Enforcement",
    "Senior Management",
    "Skilled Trade",
    "Software Development/IT",
    "Sports/Fitness",
    "Travel/Transportation",
    "Writing/Editing/Publishing",
    "Other"
]

const lastEvaluated = new Map();
const userId = await GetUserId();

// Initialising userPref map
export const initUser = async () => {
    const userPref = new Map();
    for(let category of jobParams){
        userPref.set(category, 0);
    }
    const objectPref = Object.fromEntries(userPref);
    const applied = [];
    const params = {
        TableName: 'user-pref',
        Item: {
            "UserId": userId,
            "Preferences": objectPref,
            "Applied": applied
        }
    };

    try {
        const data = await docClient.put(params).promise();
        console.log("Preferences map created for UserId :", userId);
    } catch (err){
        console.log("Error while creating preferences map", err)
    }
}

// Initialise Last Evaluated key map
export const initLastEvalute = async () =>{
    for(let category of jobParams){
        lastEvaluated.set(category, null);
    }
}

// Fetching User Preferences
let userPref, Applied = [];
export const fetchUserPreferences = async (query) => {
    const params = {
        TableName: 'user-pref',
        Key: {
            "UserId": userId
        }
    }
    const preferences = await docClient.get(params).promise();
    console.log("User Preference :",preferences);
    userPref = new Map(Object.entries(preferences.Item.Preferences));
    Applied = preferences.Item.Applied;
    // Most Preffered Categories
    let maxValue = 0;
    for( let value of userPref.values()){
        maxValue = Math.max(maxValue, value);
    }
    // Seperating jobs in most pref, secondary pref, and remaining categories
    let pref = [], others = [] , secPref = [];
    for(let category of userPref.keys()){
        if(userPref.get(category) == maxValue){
        
            pref.push(category);
        }
        else if(userPref.get(category) == 0){
            others.push(category);
        }
        else{
            secPref.push(category);
        }
    }
    if(maxValue == 0){
        others = pref;
        const preferences = [];
        for(let category of query){
            preferences.push(category.value);
        }
        pref = preferences;
    }
    return {pref, secPref, others};
}

// Updating User Preferences
export const updateUserPreferences = async (category, jobId) => {
    userPref.set(category, userPref.get(category) + 1);
    console.log(userPref);
    Applied.push(jobId);
    const objectPref = Object.fromEntries(userPref);
    const params = {
        TableName: 'user-pref',
        Item: {
            "UserId": userId,
            "Preferences": objectPref,
            "Applied": Applied
        }
    };

    try {
        await docClient.put(params).promise();
        console.log("Update Preferences completed for UserId :", userId);
    } catch (err){
        console.log("Error while updating preferences", err)
    }
}

// Fetching Jobs
export const fetchJobs = async (query, country, limit) => {
    const location = country.charAt(0).toUpperCase() + country.slice(1).toLowerCase();
    //console.log(country, lastEvaluated.get(query));
    const params = {
        TableName: 'js-api',
        KeyConditionExpression: "JobLocation = :country AND begins_with(#sortKey, :prefix)",
        ExpressionAttributeNames: {
        "#sortKey": "Category" 
        },
        ExpressionAttributeValues: {
        ":country": location,
        ":prefix": query
        },
        ExclusiveStartKey: lastEvaluated.get(query),
        Limit: limit  // Fetch only a certain number of jobs
    };

    let items = [];
    try{
        const results = await docClient.query(params).promise();
        console.log(results);
        items = results.Items;

        lastEvaluated.set(query, results.LastEvaluatedKey); // marked the last retrieved job from a category

        items = items.map(item => ({
            ...item.Jobs,   
            JobId: item.Category,
            Category: query
        }));
    }
    catch (error){
        console.log("Error", error);
        return;
    }
    return items;
}

// Fetching 14 Jobs
export const fetchCardData = async (query, country) => {
    const {pref, secPref, others} = await fetchUserPreferences(query);

    let data = [];
    let count = 0;

    console.log(pref, secPref, others);

    // Randomising Others arrray so that it always shows jobs from random categories
    for (let i = others.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); 
        [others[i], others[j]] = [others[j], others[i]]; 
    }

    for(let i = 0 ; i < pref.length ; i++){
        const jobs = await fetchJobs(pref[i], country, Math.max(Math.floor(9/pref.length),1));
        count += jobs.length;
        data.push(...jobs);
    }
    for(let i = 0 ; i < secPref.length ; i++){
        const jobs = await fetchJobs(secPref[i], country, Math.max(Math.ceil(4/secPref.length)));
        count += jobs.length;
        data.push(...jobs);

        if(count >= 14){
            break;
        }
    }
    for(let i = 0 ; i < others.length ; i++){
        const jobs = await fetchJobs(others[i], country, Math.max(Math.ceil(1/others.length)));
        count += jobs.length;
        data.push(...jobs);

        if(count >= 14){
            break;
        }
    }
    
    data = data.slice(0, 14);

    return data;
}

//fetchJobs("Software", "India", 3);
// await initUser("2541c10e-a471-42b8-91d5-3616cbb3dd91");
// await fetchUserPreferences("2541c10e-a471-42b8-91d5-3616cbb3dd91");
// await updateUserPreferences("2541c10e-a471-42b8-91d5-3616cbb3dd91","Software", 'Software Development/IT#10/12/2024#Job11')
// await updateUserPreferences("2541c10e-a471-42b8-91d5-3616cbb3dd91","Software", 'Software Development/IT#10/12/2024#Job23')
// await fetchUserPreferences("2541c10e-a471-42b8-91d5-3616cbb3dd91");
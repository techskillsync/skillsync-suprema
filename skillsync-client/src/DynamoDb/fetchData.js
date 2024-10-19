import AWS from './awsConfig.js';
const docClient = new AWS.DynamoDB.DocumentClient();
export const fetchData = async (query, country, Limit) => {
    if (typeof query !== "string") {
        console.error("Invalid query parameter:", query);
        return;
    }
    
    console.log("Searching jobs...");
    console.log(query);
    const location = country.charAt(0).toUpperCase() + country.slice(1).toLowerCase();
    console.log(location);

    let lastEvaluatedKey = null;

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
        ExclusiveStartKey: lastEvaluatedKey
        //Limit: 4  // Fetch only a certain number of jobs
    };
    if(Limit){
        params.Limit= Limit;
    }
    let items = [];
    try{
        const results = await docClient.query(params).promise();
        items = results.Items;
        for(let i = 0 ; i < items.length ; i++){
            items[i] = items[i].Jobs;
        }
        lastEvaluatedKey = results.LastEvaluatedKey;
    }
    catch (error){
        console.log("Error", error);
        return;
    }
    //console.log("The data", items); 
    return items;
}

//fetchData("Engineering", "India")

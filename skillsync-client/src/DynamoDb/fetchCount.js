import AWS from './awsConfig.js';
const docClient = new AWS.DynamoDB.DocumentClient();

export const fetchCount = async (query, location) => { 
    let count = 0;
    let lastEvaluatedKey = null;
    do{
        const params = {
            TableName: 'js-api',
            Select: 'COUNT',  // Only get the count of items, not the actual items
            FilterExpression: 'begins_with(#sortKey, :prefix)',
            ExpressionAttributeNames: {
              '#sortKey': "Category"  // Replace with your actual sort key name
            },
            ExpressionAttributeValues: {
              ':prefix': query // Replace with the string you want to match
            },
            ExclusiveStartKey: lastEvaluatedKey 
        };
        const data = await docClient.scan(params).promise();
        count += data.Count;
        lastEvaluatedKey = data.LastEvaluatedKey;
    } while(lastEvaluatedKey)
    return count;
}

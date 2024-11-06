import supabase from '../../supabase/supabaseClient'

/*
 * Using an array of OpenAI chat messages, securely gets ChatGPT's response.
 * @param {Array<Object>} messages - Chats to query ChatGPT with.
 * @returns {str} - Chat GPT's response
 * @example - query_gpt_broker(
 *    [
 *      {"role":"system","content":"You are a helpful assistant"},
 *      {"role":"user", "content":"What is the weather today?" }
 *    ]
 *  )
 */
async function query_gpt_broker(messages: Array<Object>): Promise<string> {
	const access_token = (await supabase.auth.getSession()).data.session?.access_token;
	if (!access_token) {
		throw Error("Could not get access token");
	}

	const response = await fetch(
		"https://gpt-broker.skillsync.work/advanced-gpt-4o-mini-complete",
		{
			method: "POST",
			headers: { 
				Authorization: `Bearer ${access_token}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(messages),
		}
	);

	if (!response.ok || !response.body) {
		throw Error("Request to GPT-Broker failed")
	}

	return await response.text()
}

export default query_gpt_broker

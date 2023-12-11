const OpenAI = require('openai')

const {getLocalFaqEmbeddings, getEmbeddingTextMatches, cosineSimilarity} = require('../helpers/helpers')

const generateChatbotAnswer = async question => {
	try{
		const openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY
		})
		const faqEmbeddings = await getLocalFaqEmbeddings('./files/faqEmbeddings.csv')
		const embeddingTextMatches = await getEmbeddingTextMatches('./files/embeddingTextMatches.txt')
		
		let userMessage = 'Use the below Data in Q/A form to answer the subsequent question.' + 
		'If the answer cannot be found, write "I don\'t know."' + 
		'\nData: '

		// create embedding for user question, to be compared later with stored embeddings
		const openAIEmbeddingParams = {
			model: 'text-embedding-ada-002',
			input: question
		}
		const questionEmbedding = (await openai.embeddings.create(openAIEmbeddingParams)).data[0].embedding

		// Match embeddings with their text matches and add cosine similarity with question embedding
		// for sorting and selection purposes
		const matched = faqEmbeddings.map((embedding, index) => ({
			text: embeddingTextMatches[index],
			similarity: cosineSimilarity(questionEmbedding, embedding)
		}))

		matched.sort((a, b) => b.similarity - a.similarity)

		// pick faq text chunks to send to API as "knowledge base", e.g. first 2 most similar
		for (let i = 0; i < 2; i++) {
			userMessage += matched[i].text +
		}
		// now append user question to aforementioned "knowledge base" 
		userMessage += ' --- Question: ' + question

		// finally, do a regular chat completion API call 
		const chatCompletion = await openai.chat.completions.create({
					model: "gpt-3.5-turbo",
					messages: [
						{
							role: 'system',
							content: 'You are a casual chatbot. Respond based on data provided in user message in Q/A format.'
						},
						{
							role: 'user',
							content:  userMessage
						}
					],
					temperature: 0
				})

		return chatCompletion.choices[0].message.content
	}
	catch (err){
		console.log('Error generating answer:', err)
	}
}

module.exports = {
	generateChatbotAnswer
}
const OpenAI = require('openai')
const fs = require('fs')


const saveEmbeddingsToFile = embeddings => {
	const formatted = embeddings.map(embedding => embedding.join(',')).join('\n')
	fs.writeFileSync('../files/faqEmbeddings.csv', formatted, 'utf8')
}

const saveFaqChunksToFile = chunks => {
	const formatted = chunks.join('\n')
	fs.writeFileSync('../files/embeddingTextMatches.txt', formatted, 'utf8')
}

const createEmbedding = async (textChunk, openai) => {
	const openAIEmbeddingParams = {
			model: 'text-embedding-ada-002',
			input: textChunk + ''
		}
	let resp

	resp = await openai.embeddings.create(openAIEmbeddingParams)

	return resp.data[0].embedding

	// if you are on initial/unpayed OpenAI subscription, you'll have to restrain API requests 
	// to 3/minute at most otherwise it will break
	//
	// return new Promise(resolve => {
	// 	setTimeout(async () => {
	// 		resp = await openai.createEmbedding(openAIEmbeddingParams)

	// 		resolve(resp.data.data[0].embedding)
	// 	})
	// }, 25000)
}

const generateEmbeddings = async () => {
	// Instead of creating embeddings for each Q/A combo, here we'll group them in chunks by similarity/topic
	// and do embeddings for such chunks. This way it will last shorter if you are limited to 3 req/min
	// But you can embed each Q/A as well

	let chunks = []
	let currentChunkLength = 0
	let currentChunk = 0
	let embeddings = []


	const openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY
		})

	const faqContent = await new Promise((resolve, reject) => {
		fs.readFile('../files/faq_example.json', 'utf8', (err, data) => {
				if (err) {
					reject(err)
				}
				else {
					resolve(data)
				}
			})
		})

	const faqParsed = JSON.parse(faqContent).questionsAndAnswers

	for (item of faqParsed) {
		if(chunks[currentChunk]) {
			chunks[currentChunk] += ' --- ' + JSON.stringify(item)
		}
		else {
			chunks[currentChunk] = JSON.stringify(item)
		}

		currentChunkLength += 1

	// set chunk length at whatever suits you, create next chunk when you reach it
		if (currentChunkLength === 3) {
			currentChunk += 1
			currentChunkLength = 0
		}
	}

	for (const chunk of chunks) {
		const chunkEmbedding = await createEmbedding(chunk, openai)
		embeddings.push(chunkEmbedding)
	}

	saveEmbeddingsToFile(embeddings)
	saveFaqChunksToFile(chunks)
}

module.exports = {
	generateEmbeddings
}
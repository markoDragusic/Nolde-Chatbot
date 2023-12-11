const fs = require('fs')
const {parse} = require('csv-parse')

const readFileAsync = filePath => {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				reject(err)
			}
			else {
				resolve(data)
			}
		})
	})
}

const getLocalFaqEmbeddings = async filePath => {
	try{
		const embeddingsData = await readFileAsync(filePath)

		const parsedData = await new Promise((resolve, reject) => {
			parse(embeddingsData, {columns: false}, (err, records) => {
				if (err) {
					reject(err)
				}
				else {
					resolve(records)
				}
			})
		})

		return parsedData	
	}
	catch (err) {
		console.log('Error reading embeddings file:', err.message)
	}	
}

const getEmbeddingTextMatches = async filePath => {
	try{
		return (await readFileAsync(filePath)).split('\n')
	}
	catch (err) {
		console.log('Error reading text matches file:', err.message)
	} 
}

const cosineSimilarity = (A, B) => {
    var dotproduct = 0;
    var mA = 0;
    var mB = 0;

    for(var i = 0; i < A.length; i++) {
        dotproduct += A[i] * B[i];
        mA += A[i] * A[i];
        mB += B[i] * B[i];
    }

    mA = Math.sqrt(mA)
    mB = Math.sqrt(mB)
    var similarity = dotproduct / (mA * mB)

    return similarity
}

module.exports = {
	getLocalFaqEmbeddings,
	getEmbeddingTextMatches,
	cosineSimilarity
}
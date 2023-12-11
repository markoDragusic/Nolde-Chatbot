# Nolde Chatbot

This is an example of how basic OpenAI chatbot can be done if you have an olde version like 10, that doesn't support Langchain or other utilities such as local vector databases etc.
It is based on this official OpenAI Python example: https://github.com/openai/openai-cookbook/blob/main/examples/Question_answering_using_embeddings.ipynb

## Usage

To prepare for execution, first go to 'scripts' folder and do

```bash
node generateEmbeddings
```

That will create 'faqEmbeddings' and 'embeddingTextMatches' files. I left generated files in 'files' folder just as an example. Those will get overwritten, of course, once you execute the script.

To use the chatbot, you can do something as simple as 

```bash
curl localhost:9090/?question=who%20owns%twitter%20now
```

or Postman, Insomnia like platforms, or even plain browser tab. 
You can go even further and combine it with some chatbot frontend solution.

Enjoy!

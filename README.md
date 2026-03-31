## 📌DocuMind

# About Project

DocuMind is an intelligent document based question answeing system that allows user to ask questioons  on the based of their document served to DocuMind System

-This system in build based on RAG(Retrival-Augmented Generation) wher it combines document retrieval with language model to produce context aware responses.

---
# ⚙️How It Works
- User serves the Pdf to System
- Pdf is first processedd and then divided into smaller chunks
- Thos chunnks are converted into e vector embeddings
- after it when use ask a question:
  - the sytem retrives the most relavent chunks
  - these chunks are passedd as context to the language model
  - the model generates a precise and meaningsul answeers


---

# Tech Stack

- Python
- HTMl (For GUI)
- CSS  (For GUI)
- JavaScript  (For GUI)
- Ollama
- vector Embeddings
- RAG Architecture

---
# 🎯 Key Features

- Ask questions directly from PDFs
- Fast and relevant information retrieval
- Context-aware answers (not generic responses)
- Simple and interactive user interface
- Reduces manual reading effort

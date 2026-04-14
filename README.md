# DocuMind AI 🧠

### RAG-Based AI Document Assistant


# About Project

DocuMind is an intelligent document based question answeing system that allows user to ask questioons  on the based of their document served to DocuMind System

> This system in build based on RAG(Retrival-Augmented Generation) wher it combines document retrieval with language model to produce context aware responses.

---
# Live Demo 
 Try it now -https://huggingface.co/spaces/AumLakhani/DOCUMIND-ai

 ---

 # Pictures
 
 
# ⚙️ How It Works — RAG Pipeline
 
```
User uploads PDF
      ↓
pdf_loader.py   →   Extract raw text from PDF
      ↓
chunking.py     →   Split text into smaller chunks
      ↓
embeddings.py   →   Convert chunks to vector embeddings
      ↓
vector_store.py →   Store vectors in FAISS index
      ↓
User asks question
      ↓
embeddings.py   →   Convert question to vector
      ↓
vector_store.py →   Find most relevant chunks (similarity search)
      ↓
qa_pipeline.py  →   Send chunks + question to Groq (Llama3)
      ↓
                    Generate intelligent answer
```
 
---
 
# 🛠️ Tech Stack
 
| Layer | Technology | Purpose |
|---|---|---|
| Frontend | HTML, CSS, Vanilla JS | User interface |
| Backend | Python, Flask | API server |
| PDF Processing | PyMuPDF, pypdf | Extract text from PDFs |
| Embeddings | Sentence Transformers | Convert text to vectors |
| Vector DB | FAISS | Store & search embeddings |
| LLM | Groq API + Llama3 | Generate answers |
| Deployment | Docker, Hugging Face Spaces | Cloud hosting |
 
---
# ☁️ Deployment
 
This app is deployed on **Hugging Face Spaces** using Docker.

---
# 🎯 Key Features

- Ask questions directly from PDFs
- Fast and relevant information retrieval
- Context-aware answers (not generic responses)
- Simple and interactive user interface
- Reduces manual reading effort

---
# 🧠 What I Learned
 
- Building a complete RAG pipeline from scratch
- Working with FAISS vector databases
- Integrating Groq API for fast LLM inference
- Connecting frontend and backend end-to-end
- Deploying ML apps with Docker + Hugging Face Spaces
 
---
# 📄 License
 
This project is licensed under the MIT License.
---

# 👤 Author
 
**Aum Lakhani**

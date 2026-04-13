import ollama

def generate_answer(query, chunks):

    
    clean_chunks = [c.replace("\n", " ").strip() for c in chunks[:3]]

    
    context = " ".join(clean_chunks)

    prompt = f"""
You are an intelligent AI assistant.

Answer the question clearly and professionally using ONLY the provided context.

Rules:
- Do NOT repeat the context
- Do NOT copy text directly
- Explain in simple and clear language
- Give structured answer (short paragraphs or bullet points)
- If answer is not found, say: "Answer not found in document"

Context:
{context}

Question:
{query}

Answer:
"""

    response = ollama.chat(
        model='phi3',  # or your model
        messages=[{"role": "user", "content": prompt}],
        options={
            "temperature": 0.2,   # 🔥 more accuracy
            "top_p": 0.9
        }
    )

    return response['message']['content']
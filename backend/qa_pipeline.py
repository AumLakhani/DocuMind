import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

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

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=500
    )

    return response.choices[0].message.content
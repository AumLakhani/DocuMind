import faiss
import numpy as np

def create_faiss_index(embeddings):
    dimension = len(embeddings[0])  # size of vector
    
    index = faiss.IndexFlatL2(dimension)
    
    index.add(np.array(embeddings))
    
    return index


def search(index, query_embedding, chunks, k=3):
    distances, indices = index.search(np.array([query_embedding]), k)
    
    results = [chunks[i] for i in indices[0]]
    
    return results
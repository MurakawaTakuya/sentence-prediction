import openai
import os
import time
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_text(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "ユーザーからのメッセージの文章の続きを1文のみ生成してください。文章を結合した時に間のスペースが正しくなるようにしてください。"},
            {"role": "user", "content": prompt} 
        ],
        max_tokens=50, 
        temperature=0.5,
        top_p=1,
        frequency_penalty=0,
    )
    
    text = response.choices[0].message['content'].strip()
    return text

input_text = input("Incomplete sentence: ")

start_time = time.time()

generated_text = generate_text(input_text)

elapsed_time = time.time() - start_time

print("> " + generated_text)
print(f"Response time: {elapsed_time:.2f} seconds")

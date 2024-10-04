import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_text(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "ユーザーからのメッセージの文章の続きを1文のみ生成してください。"},
            {"role": "user", "content": prompt} 
        ],
        max_tokens=150, 
        temperature=0.7,
    )
    
    text = response.choices[0].message['content'].strip()
    print(response)
    return text

input_text = input("Incomplete sentence: ")

generated_text = generate_text(input_text)

print("> " + generated_text)

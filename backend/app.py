import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from groq import Groq

# 환경 변수 로드
load_dotenv()

app = Flask(__name__)
# CORS 설정: 프론트엔드에서의 접근 허용
CORS(app)

# Groq 클라이언트 초기화
api_key = os.getenv("GROQ_API_KEY")
client = None

if api_key and api_key != "your_groq_api_key_here":
    try:
        client = Groq(api_key=api_key)
        print("✅ Groq Client initialized successfully.")
    except Exception as e:
        print(f"❌ Failed to initialize Groq Client: {e}")
else:
    print("⚠️ GROQ_API_KEY is not set or invalid. Please check .env file.")

@app.route('/health', methods=['GET'])
def health_check():
    """서버 상태 확인용 엔드포인트"""
    return jsonify({
        "status": "ok",
        "message": "BizTone Converter Backend is running",
        "groq_client_ready": client is not None
    })

@app.route('/api/convert', methods=['POST'])
def convert_text():
    """
    말투 변환 API 엔드포인트 (1단계: 초기 연동)
    """
    data = request.json
    
    if not data or 'text' not in data or 'target' not in data:
        return jsonify({"error": "Invalid input. 'text' and 'target' are required."}), 400

    original_text = data['text']
    target_role = data['target'] # boss, colleague, customer

    # 1단계 목표: Groq AI API 연동 초기 구현 (간단한 테스트 연동)
    # 실제 프롬프트 엔지니어링 및 정교한 로직은 Sprint 3에서 구현 예정
    
    if client:
        try:
            # 간단한 테스트용 호출
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": f"Convert the following text to a professional tone suitable for a {target_role}. Keep the language Korean."
                    },
                    {
                        "role": "user",
                        "content": original_text,
                    }
                ],
                model="llama3-8b-8192", # Groq에서 지원하는 모델 예시
            )
            converted_text = chat_completion.choices[0].message.content
        except Exception as e:
            print(f"Groq API Error: {e}")
            return jsonify({"error": "Failed to process with AI", "details": str(e)}), 500
    else:
        # API 키가 설정되지 않았을 때의 더미 응답 (개발 테스트용)
        converted_text = f"[TEST MODE] ({target_role}에게): {original_text} (API Key 미설정으로 인한 더미 응답입니다)"

    return jsonify({
        "original": original_text,
        "converted": converted_text,
        "target": target_role
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)

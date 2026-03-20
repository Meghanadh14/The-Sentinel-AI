import json
import ollama
from kafka import KafkaConsumer, KafkaProducer
import firebase_admin
from firebase_admin import credentials, db

# 1. Setup Firebase (Connects your Mac to your Vercel Dashboard)
# Note: You'll need to download your 'serviceAccountKey.json' from Firebase Console
if not firebase_admin._apps:
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://your-project-id.firebaseio.com'
    })

# 2. Setup Kafka
consumer = KafkaConsumer('policy-events', bootstrap_servers='localhost:9092')
producer = KafkaProducer(bootstrap_servers='localhost:9092')

def heal_with_ai(raw_data):
    """Uses Llama 3 to map p_id -> policyId and state -> status"""
    prompt = (
        f"You are a Guidewire Data Integrator. Convert this malformed JSON "
        f"to a valid schema. Map 'p_id' to 'policyId' and 'state' to 'status'. "
        f"Return ONLY the JSON. No talk. Data: {raw_data}"
    )
    
    try:
        response = ollama.generate(model='llama3', prompt=prompt)
        text = response['response'].strip()
        
        # Extract JSON from potential AI chatter
        start = text.find('{')
        end = text.rfind('}') + 1
        return json.loads(text[start:end])
    except Exception as e:
        print(f"AI Healing Failed: {e}")
        return None

print("[*] Sentinel-AI is LIVE. Watching Kafka stream...")

for message in consumer:
    raw_event = json.loads(message.value.decode('utf-8'))
    print(f"\n[INTERCEPTED]: {raw_event}")
    
    healed_event = heal_with_ai(raw_event)
    
    if healed_event:
        print(f"[HEALED]: {healed_event}")
        
        # Push to Kafka for the Backend
        producer.send('healed-events', json.dumps(healed_event).encode('utf-8'))
        
        # Push to Firebase for the React "Sink"
        db.reference('/live_logs').push({
            'original': raw_event,
            'healed': healed_event,
            'timestamp': {'.sv': 'timestamp'}
        })
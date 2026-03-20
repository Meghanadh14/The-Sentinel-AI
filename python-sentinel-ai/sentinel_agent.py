import json
import ollama
import datetime
from kafka import KafkaConsumer, KafkaProducer
import firebase_admin
from firebase_admin import credentials, db

# 1. CONNECT TO FIREBASE (Syncs with React)
try:
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://YOUR_REAL_PROJECT.firebaseio.com'
    })
    print("[+] Firebase connected successfully.")
except Exception as e:
    print(f"[!] Firebase connection error: {e}")

# 2. CONNECT TO KAFKA (The Pipes)
consumer = KafkaConsumer('policy-events', bootstrap_servers='localhost:9092')
producer = KafkaProducer(bootstrap_servers='localhost:9092')

# 3. THE AI LOGIC
def heal_data(raw_data):
    prompt = f"Convert this malformed JSON to a valid schema. Map 'p_id' to 'policyId' and 'state' to 'status'. Return ONLY the JSON object, no explanation: {raw_data}"
    try:
        response = ollama.generate(model='llama3', prompt=prompt)
        text = response['response'].strip()
        start = text.find('{')
        end = text.rfind('}') + 1
        return json.loads(text[start:end])
    except Exception as e:
        print(f"Extraction Error: {e}")
        return None

print("[*] Sentinel-AI is LIVE. Waiting for messages...")

# 4. THE INTERCEPTION LOOP
for message in consumer:
    raw_data = json.loads(message.value.decode('utf-8'))
    print(f"\n[Intercepted]: {raw_data}")
    
    healed = heal_data(raw_data)
    
    if healed:
        print(f"[Healed]: {healed}")
        producer.send('healed-events', json.dumps(healed).encode('utf-8'))
        
        # Push to the React Dashboard
        current_time = datetime.datetime.now().strftime("%H:%M:%S")
        db.reference('/live_logs').push({
            'original': raw_data,
            'healed': healed,
            'timestamp': current_time
        })
    else:
        print("[Failed]: AI returned unparseable data.")
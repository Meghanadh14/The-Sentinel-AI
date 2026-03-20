import json
import requests
from kafka import KafkaConsumer, KafkaProducer

consumer = KafkaConsumer(
    'policy-events',
    bootstrap_servers='localhost:9092',
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def heal_payload(bad_payload):
    prompt = f"Fix this JSON payload to match the schema with exact keys 'policyId', 'status', 'timestamp'. Return ONLY valid JSON: {bad_payload}"
    try:
        response = requests.post('http://localhost:11434/api/generate', json={
            "model": "llama3",
            "prompt": prompt,
            "stream": False
        })
        fixed_json_string = response.json()['response'].strip()
        if fixed_json_string.startswith("```json"):
            fixed_json_string = fixed_json_string[7:-3].strip()
        return json.loads(fixed_json_string)
    except:
        return None

for message in consumer:
    payload = message.value
    if 'status' not in payload or 'policyId' not in payload:
        healed_payload = heal_payload(payload)
        if healed_payload:
            producer.send('billing-events', healed_payload)
            print(f"Healed: {healed_payload}")
        else:
            producer.send('dead-letter-queue', payload)
            print(f"Failed: {payload}")
    else:
        producer.send('billing-events', payload)
        print(f"Passed: {payload}")

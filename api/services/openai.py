import os, json
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM = (
    "You are a movie recommendation expert. "
    "Given multiple users' liked movies (title, year), propose ~10 movies "
    "they will enjoy together. Avoid anything already liked. "
    "Return ONLY a JSON object with key 'recommendations', an array of "
    "items with {title, year, why}."
)

def generate_recommendations(group_library: list[dict]) -> dict:
    prompt = (
        "Members' libraries:\n"
        f"{json.dumps(group_library, ensure_ascii=False)}\n\n"
        "Return only JSON with: { \"recommendations\": [{\"title\":\"...\",\"year\":YYYY,\"why\":\"...\"}] }"
    )

    resp = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user",   "content": prompt},
        ],
        # JSON mode (the model must emit a single valid JSON object)
        response_format={"type": "json_object"},
        temperature=0.5,
    )

    content = resp.choices[0].message.content
    return json.loads(content)

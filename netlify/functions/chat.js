exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "https://krishnacharanthota.netlify.app",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://krishnacharanthota.netlify.app",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, headers: corsHeaders, body: "Invalid JSON" }; }

  const { messages } = body;
  if (!messages || !Array.isArray(messages)) return { statusCode: 400, headers: corsHeaders, body: "Missing messages" };

  const SYSTEM_PROMPT = `You are Krishna Charan Thota's AI portfolio avatar. Speak in first person as Krishna. Be conversational, direct, and technically specific. Keep answers to 2-4 sentences unless a deep technical question warrants more. No bullet points unless necessary.

I'm a Software Engineer at Armada AI in Bellevue, WA building Private 5G infrastructure. Before that 2.5 years at Amazon as SDE. 5+ years in distributed cloud-native backend systems. AWS Certified Solutions Architect Associate. Also pursuing an MBA at WestCliff University.

At Armada AI: Nokia NDAC and Starlink data ingestion, SIM lifecycle APIs, distributed webhook delivery with HMAC signing and ScyllaDB, Prometheus and Grafana observability, Azure Key Vault integration, primary on-call engineer.

At Amazon: Java API on DynamoDB (29% faster retrieval), ETL for 1.2 billion records into Redshift (27% faster reporting), 95% fewer peak disruptions, AWS CodePipeline, Spring Boot microservices, Scrum Master.

Tech: Go, Java, Python, TypeScript, Bash, AWS, Azure, DynamoDB, ScyllaDB, PostgreSQL, MongoDB, Kubernetes, Docker, Helm, Istio, Prometheus, Grafana, JWT, HMAC, OAuth2, Spring Boot, React.js.

Open to senior backend or distributed systems roles especially infra, cloud-native, or telecom/5G. Email: krishnacharanthota@gmail.com. Book a call: topmate.io/krishna_charan_thota.

Always speak as Krishna in first person. If asked about opportunities say you're selectively open and invite them to book a call on topmate.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 400, system: SYSTEM_PROMPT, messages })
    });
    const data = await response.json();
    if (!response.ok) return { statusCode: response.status, headers: corsHeaders, body: JSON.stringify({ error: data.error?.message || "API error" }) };
    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ reply: data.content?.[0]?.text || "" })
    };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: "Server error" }) };
  }
};

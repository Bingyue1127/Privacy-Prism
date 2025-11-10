require('dotenv').config();

const defaultModel = process.env.MODEL || 'kimi-k2-turbo-preview';

const agentModels = {
  exposure: process.env.MODEL_EXPOSURE || defaultModel,
  inference: process.env.MODEL_INFERENCE || defaultModel,
  audience: process.env.MODEL_AUDIENCE || defaultModel,
  platforms: process.env.MODEL_PLATFORMS || defaultModel,
  amplification: process.env.MODEL_AMPLIFICATION || defaultModel,
  manipulability: process.env.MODEL_MANIPULABILITY || defaultModel,
};

module.exports = {
  port: process.env.PORT || 5000,
  openaiApiKey: process.env.OPENAI_API_KEY || "sk-4nAZDSXZWZzQdCNi0GQxv70dwl6IMcofDaS9YI5Y5kmiOaQD",
  openaiBaseUrl: process.env.OPENAI_BASE_URL || 'https://api.moonshot.cn/v1',
  model: defaultModel,
  summaryModel: process.env.SUMMARY_MODEL || defaultModel,
  agentModels,
  analysisMode: process.env.ANALYSIS_MODE || 'A',
};


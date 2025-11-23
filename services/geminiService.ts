import { GoogleGenAI } from "@google/genai";
import { ServerMetrics } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSystemHealth = async (metrics: ServerMetrics): Promise<string> => {
  try {
    const prompt = `
      Bạn là một kỹ sư DevOps AI giám sát máy chủ.
      Phân tích các số liệu sau và đưa ra một báo cáo trạng thái ngắn gọn (tối đa 2 câu) bằng tiếng Việt.
      Văn phong chuyên nghiệp, công nghệ.
      
      Metrics:
      - CPU: ${metrics.cpu}%
      - Memory: ${metrics.memory}%
      - Latency: ${metrics.latency}ms
      - Active Users: ${metrics.activeUsers}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Hệ thống đang hoạt động bình thường.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Không thể kết nối đến AI phân tích.";
  }
};

export const generatePostContent = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Viết một status cập nhật ngắn (1 câu) về chủ đề "${topic}" cho mạng xã hội nội bộ của một công ty công nghệ. Tiếng Việt.`,
    });
    return response.text || topic;
  } catch (e) {
      return topic;
  }
}
import apiClient from "../../../services/apiClient";

/** Send the existing assistant context to our backend; Groq credentials stay server-side. */
export const callGrok = async (userMessage, productsData = [], conversation = []) => {
  const response = await apiClient.post("/assistant/chat", {
    userMessage,
    productsData,
    conversation,
  });

  const answer = response.data?.result;
  if (typeof answer !== "string" || !answer.trim()) {
    throw new Error("AI Assistant không trả về câu trả lời.");
  }

  return answer;
};

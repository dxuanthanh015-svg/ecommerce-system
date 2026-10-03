import { product_mock_data } from "../../../Data/product_mock_data.js";

const API_KEY = import.meta.env.VITE_GROK_API_KEY;

const filterProductsForPrompt = (userMessage, products = []) => {
  const query = userMessage.toLowerCase().trim();

  if (!query || query.length < 2) {
    return products.slice(0, 12);
  }

  const keywords = query.split(/\s+/).filter(k => k.length > 1);

  const scoredProducts = products.map(product => {
    let score = 0;
    const title = (product.title || product.name || "").toLowerCase();
    const desc = (product.description || "").toLowerCase();
    const brand = (product.brand || "").toLowerCase();
    const category = [
      product.topLavelCategory,
      product.secondLavelCategory,
      product.thirdLavelCategory,
      product.fourthLavelCategory,
      product.topLevelCategory,
      product.secondLevelCategory,
      product.thirdLevelCategory,
      product.fourthLevelCategory
    ].filter(Boolean).join(" ").toLowerCase();

    for (const kw of keywords) {
      if (title.includes(kw)) score += 10;
      if (category.includes(kw)) score += 8;
      if (brand.includes(kw)) score += 5;
      if (desc.includes(kw)) score += 2;
    }

    if (product.isTrending && score > 0) score += 2;
    if (product.isFlashSale && score > 0) score += 2;

    return { product, score };
  });

  const matched = scoredProducts
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);

  if (matched.length > 0) {
    return matched.slice(0, 12);
  }

  return products.slice(0, 12);
};

const buildSimplifiedProducts = (productsData = []) =>
  productsData.map((item) => ({
    id: item.id,
    name: item.title || item.name,
    price: item.price,
    discountedPrice: item.discountedPrice,
    inStock: (item.quantity !== undefined ? item.quantity > 0 : true) || item.inStock,
    image: item.imageUrl || item.image,
    description: item.description ? item.description.substring(0, 80) + "..." : "",
    sizes: (item.size || item.sizes || []).map(s => typeof s === 'object' ? s.name : s),
    color: item.color,
    brand: item.brand,
    category: `${item.topLavelCategory || item.topLevelCategory || ""} > ${item.secondLavelCategory || item.secondLevelCategory || ""}`
  }));

const getDemoReply = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("áo") || lowerMessage.includes("hoodie") || lowerMessage.includes("shirt")) {
    return "Mình gợi ý bạn xem các mẫu áo thun và hoodie thời trang mới nhất. Ví dụ:\n\n![Heavyweight Cotton Oversized Tee](https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1600&auto=format&fit=crop)\n\nNếu bạn muốn, tôi có thể recommend theo phong cách sporty, basic hay premium.";
  }

  if (lowerMessage.includes("giày") || lowerMessage.includes("sneaker") || lowerMessage.includes("shoes")) {
    return "Bạn đang tìm giày sneaker hoặc giày đi chơi? Mình gợi ý mẫu này:\n\n![Ultra Light Running Shoes](https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1600&auto=format&fit=crop)\n\nĐộ bền tốt, giá hợp lý và phù hợp mặc hằng ngày.";
  }

  if (lowerMessage.includes("size") || lowerMessage.includes("kích thước") || lowerMessage.includes("fit")) {
    return "Theo size guide của cửa hàng: S (45-53kg), M (54-63kg), L (64-72kg), XL (73-82kg). Nếu bạn cho mình biết cân nặng và chiều cao, mình sẽ gợi ý size phù hợp.";
  }

  if (lowerMessage.includes("sale") || lowerMessage.includes("khuyến mãi") || lowerMessage.includes("giảm")) {
    return "Hiện có nhiều sản phẩm đang giảm giá, đặc biệt là áo khoác, quần thể thao và sneakers. Ví dụ:\n\n![Winter Explorer Waterproof Jacket](https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1600&auto=format&fit=crop)\n\nBạn muốn mình gợi ý theo ngân sách cụ thể không?";
  }

  if (lowerMessage.includes("đơn") || lowerMessage.includes("order") || lowerMessage.includes("ship") || lowerMessage.includes("vận chuyển")) {
    return "Bạn có thể hỏi mình về trạng thái đơn hàng, thời gian giao hàng hoặc chính sách đổi trả. Nếu cần, mình sẽ hỗ trợ tư vấn nhanh.";
  }

  return "Mình là NexCart AI, có thể hỗ trợ bạn tìm sản phẩm, tư vấn size, kiểm tra khuyến mãi và gợi ý theo phong cách. Bạn muốn tìm sản phẩm theo danh mục nào?";
};

export const callGrok = async (userMessage, productsData = product_mock_data, conversation = []) => {
  if (!API_KEY) {
    console.warn("⚠️ VITE_GROK_API_KEY chưa được cấu hình. Hệ thống chuyển sang Demo Reply.");
    return getDemoReply(userMessage);
  }

  try {
    // 🔍 Lọc sản phẩm phù hợp nhất với tin nhắn của khách hàng để tối ưu kích thước prompt
    const filteredProducts = filterProductsForPrompt(userMessage, productsData);
    const simplifiedProducts = buildSimplifiedProducts(filteredProducts);

    const pastMessages = conversation
      .slice(-8)
      .filter((msg) => msg && msg.text)
      .map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

    const systemPrompt = `
      Bạn là NexCart AI - Trợ lý tư vấn bán hàng thời trang chuyên nghiệp.
      - Trả lời thân thiện, lịch sự bằng tiếng Việt.
      - Hãy duy trì ngữ cảnh của cuộc hội thoại và trả lời như một người tư vấn tiếp tục cuộc trò chuyện.
      - Chỉ được phép gợi ý các sản phẩm dựa trên danh sách dữ liệu JSON dưới đây:
      ${JSON.stringify(simplifiedProducts)}
      - Bảng size chuẩn: S (45-53kg), M (54-63kg), L (64-72kg), XL (73-82kg).
      - Nếu sản phẩm hết hàng, hãy cảnh báo rõ ràng.
      - Trả lời ngắn gọn, dễ hiểu, giúp khách hàng quyết định mua hàng.
      - Có thể hỏi tiếp nếu cần làm rõ nhu cầu.
      - QUAN TRỌNG: Khi gợi ý hoặc giới thiệu bất kỳ sản phẩm nào cho khách hàng, hãy LUÔN kèm theo ảnh của sản phẩm đó bằng cú pháp ảnh Markdown chính xác: \`![tên sản phẩm](đường dẫn ảnh)\`. Ví dụ: \`![Winter Explorer Waterproof Jacket](https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1600&auto=format&fit=crop)\`.
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          ...pastMessages,
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log(data)
    if (!response.ok) {
      throw new Error(data?.error?.message || `Grok request failed with status ${response.status}`);
    }

    return data.choices?.[0]?.message?.content || "Không nhận được câu trả lời từ Groq.";
  } catch (error) {
    console.error("Groq call failed:", error);
    return getDemoReply(userMessage);
  }
};
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  const { imageUrl, productImageUrl } = await request.json();

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    
  });


  const model = "gemini-3-pro-image-preview";

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `Place the school photo:${imageUrl} on the product image:${productImageUrl} In order to show a preview of how the school photo would look when printed on the product. Make sure the school photo is clearly visible and well-integrated with the product image. The final output should be a single image that combines both elements seamlessly. use the exact images I have uploaded to generate the preview.`,
        },
      ],
      
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config:{
        responseModalities: ["IMAGE", "TEXT"],
        temperature: 1,
        
    },
    contents,
    
  });

  let generatedImageData: string | null = null;

  for await (const chunk of response) {
    if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
      continue;
    }
    if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
      generatedImageData = chunk.candidates[0].content.parts[0].inlineData.data || null;
      break; // Exit once we get the image data
    }
    else {
      console.log(chunk.text);
    }
  }

  if (!generatedImageData) {
    return new Response(JSON.stringify({ error: 'No image generated' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Convert base64 to buffer
  const imageBuffer = Buffer.from(generatedImageData, 'base64');

  return new Response(imageBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': imageBuffer.length.toString(),
    },
  });
}

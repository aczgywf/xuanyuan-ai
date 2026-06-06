interface ImageGenOptions {
  imageType: string;
  ratio: string;
  style: string;
  scene: string;
  whitespace: string;
  topic: string;
  extras: string;
}

export function assemblePrompt(options: ImageGenOptions): string {
  let prompt = `生成一张${options.imageType}，比例为${options.ratio}`;

  if (options.style) prompt += `，采用${options.style}风格`;
  if (options.scene) prompt += `，场景为${options.scene}`;
  if (options.whitespace) prompt += `，留白要求：${options.whitespace}`;

  prompt += `。\n主题：${options.topic}。`;

  if (options.extras) prompt += `\n补充要求：${options.extras}`;

  return prompt;
}

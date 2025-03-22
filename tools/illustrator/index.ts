import type { StableDiffusionPayload, PromptData } from "./sd-interface.ts";
import { $ } from 'bun';
import prompts from './genesis_prompts.json';
const { STABLE_DIFFUSION_URL } = process.env;
import { mkdirp } from 'mkdirp'

// Load the prompts from the JSON file
// const prompts: PromptData[] = await Bun.file("genesis_prompts.json").json();

// Stable Diffusion API endpoint (adjust this to your setup)
const apiEndpoint: string = `${STABLE_DIFFUSION_URL}/sdapi/v1/txt2img`;

// Configuration
const imagesPerChapter: number = 100; // Total images per chapter
const batchSize: number = 4; // Number of images per API request (adjust based on your hardware)
const batchesPerChapter: number = Math.ceil(imagesPerChapter / batchSize); // Number of batches needed per chapter

// Function to generate images for a given chapter
async function generateImagesForChapter(promptData: PromptData): Promise<void> {
  const { chapter, positive_prompt, negative_prompt } = promptData;

  // Prepare the base payload for the Stable Diffusion API
  const basePayload: StableDiffusionPayload = {
    prompt: positive_prompt,
    negative_prompt: negative_prompt,
    steps: 50, // Number of sampling steps
    cfg_scale: 7.5, // Classifier-free guidance scale
    width: 512, // Image width
    height: 512, // Image height
    sampler_name: "Euler a", // Sampler
    batch_size: batchSize, // Number of images per batch
    seed: -1, // Random seed for variety
    enable_hr: false, // Disable high-res for faster generation
  };

  // Create a directory for this chapter's images
  const chapterDir: string = chapter.replace(" ", "_").toLowerCase();
  await mkdirp(chapterDir); // Create directory (Bun creates dirs when writing files)

  let totalImagesGenerated: number = 0;

  // Generate images in batches until we reach 100
  for (let batch = 1; batch <= batchesPerChapter; batch++) {
    // Calculate how many images to generate in this batch
    const remainingImages: number = imagesPerChapter - totalImagesGenerated;
    const currentBatchSize: number = Math.min(batchSize, remainingImages);

    if (currentBatchSize <= 0) break;

    const payload: StableDiffusionPayload = {
      ...basePayload,
      batch_size: currentBatchSize,
    };

    try {
      console.log(`Generating batch ${batch}/${batchesPerChapter} for ${chapter} (${currentBatchSize} images)...`);

      // Make the API request
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data: { images: string[] } = await response.json();

      // Save each image in the batch
      for (let i = 0; i < data.images.length; i++) {
        const imageBase64: string = data.images[i];
        const imageBuffer: Buffer = Buffer.from(imageBase64, "base64");

        // Generate a unique filename (e.g., genesis_1_001.png)
        const imageIndex: number = totalImagesGenerated + i + 1;
        const fileName: string = `illustrations/${chapterDir}/${chapterDir}_${String(imageIndex).padStart(3, "0")}.png`;
        await Bun.write(fileName, imageBuffer);
      }

      totalImagesGenerated += data.images.length;
      console.log(`Batch ${batch} for ${chapter} completed. Total images: ${totalImagesGenerated}/${imagesPerChapter}`);
    } catch (error: any) {
      await fetch('https://ntfy.andrepadez.com/mybiblebrother', {
        method: 'POST', // PUT works too
        body: 'Illustrator process has crashed. Restarting Stable diffusion'
      });

      console.error(`Error in batch ${batch} for ${chapter}:`, error.message);

      console.log('ERRORED!', 'restarting mlx-audio server in 5 seconds');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await $`/opt/homebrew/bin/pm2 restart "Stable Diffusion"`.text();
      await new Promise((resolve) => setTimeout(resolve, 5000));
      continue

    }
  }

  console.log(`Finished generating ${totalImagesGenerated} images for ${chapter}`);
}

// Loop through the prompts and generate images for each chapter
for (const prompt of prompts) {
  await generateImagesForChapter(prompt);
}

console.log("All images for all chapters generated!");
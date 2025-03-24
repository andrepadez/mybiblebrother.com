import type { StableDiffusionPayload, PromptData } from "./sd-interface.ts";
import { $ } from 'bun';
import prompts from './genesis_prompts.json';
const { STABLE_DIFFUSION_URL } = process.env;
import { mkdirp } from 'mkdirp'

// Stable Diffusion API endpoints
const apiEndpoint: string = `${STABLE_DIFFUSION_URL}/sdapi/v1/txt2img`;
const progressEndpoint: string = `${STABLE_DIFFUSION_URL}/sdapi/v1/progress`;

// Configuration
const imagesPerChapter: number = 100; // Total images per chapter
const batchSize: number = 1; // Fixed batch size of 1 image per request
const batchesPerChapter: number = imagesPerChapter; // One batch per image
const maxRetries: number = 3; // Maximum retries for a fetch request
const retryDelay: number = 5000; // Delay between retries (5 seconds)
const batchDelay: number = 5000; // Delay between batches (5 seconds)

const skipChapters = 10;

// Define the type for the progress response from /sdapi/v1/progress
interface ProgressResponse {
  progress: number; // Progress as a float (0 to 1)
  eta: number; // Estimated time remaining in seconds
  state: {
    job: string;
    job_count: number;
    job_no: number;
    sampling_step: number;
    sampling_steps: number;
  };
}

// Function to create a detailed progress bar
function createProgressBar(progress: number, eta: number | null, width: number = 20): string {
  const filled = Math.round(progress * width);
  const empty = width - filled;
  const percentage = Math.round(progress * 100);
  const etaText = eta !== null && !isNaN(eta) ? ` ETA: ${Math.round(eta)}s` : " ETA: Unknown";
  return `[${"█".repeat(filled)}${"-".repeat(empty)}] ${percentage}%${etaText}`;
}

// Function to determine if an error is a Stable Diffusion error
function isStableDiffusionError(error: any): boolean {
  // HTTP errors (e.g., 400, 500) indicate a Stable Diffusion server issue
  if (error.message && error.message.includes("Generation failed with status")) {
    return true;
  }
  // Fetch failed with status (from fetchWithRetries)
  if (error.message && error.message.includes("Fetch failed with status")) {
    return true;
  }
  // Network errors like ECONNRESET, ECONNREFUSED, or timeouts are not Stable Diffusion errors
  if (error.code === "ABORT_ERR" || error.message.includes("timed out")) {
    return false;
  }
  if (error.code === "ECONNRESET" || error.code === "ECONNREFUSED") {
    return false;
  }
  // Default to false for other errors (e.g., JavaScript runtime errors)
  return false;
}

// Function to poll the progress endpoint and handle completion/errors
async function pollProgress(fetchPromise: Promise<Response>): Promise<{ progress: number; eta: number | null; error?: string; errorType?: 'stable-diffusion' | 'internal'; completed?: boolean }> {
  try {
    const response = await fetch(progressEndpoint);
    if (!response.ok) {
      throw new Error(`Progress request failed with status ${response.status}`);
    }
    const data: ProgressResponse = await response.json();

    // Check for completion
    if (data.state.sampling_step >= data.state.sampling_steps && data.state.sampling_steps > 0) {
      return { progress: 1, eta: 0, completed: true };
    }

    // Check for errors or completion via the fetch promise
    if (data.state.job === "" && data.progress === 0 && data.state.sampling_step === 0) {
      try {
        const fetchResponse = await fetchPromise;
        if (!fetchResponse.ok) {
          throw new Error(`Generation failed with status ${fetchResponse.status}`);
        }
        // If fetchPromise resolves successfully, assume the job is complete
        return { progress: 1, eta: 0, completed: true };
      } catch (error: any) {
        const errorType = isStableDiffusionError(error) ? 'stable-diffusion' : 'internal';
        return { progress: 0, eta: null, error: error.message, errorType };
      }
    }

    return { progress: data.progress, eta: data.eta };
  } catch (error: any) {
    console.error(`Error polling progress: ${error.message}`);
    const errorType = isStableDiffusionError(error) ? 'stable-diffusion' : 'internal';
    return { progress: 0, eta: null, error: error.message, errorType };
  }
}

// Function to perform a fetch request with retries
async function fetchWithRetries(url: string, options: RequestInit, retries: number = maxRetries): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Fetch attempt ${attempt}/${retries} for ${url}`);
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Fetch failed with status ${response.status}`);
      }
      return response;
    } catch (error: any) {
      if (attempt === retries) {
        const errorType = isStableDiffusionError(error) ? 'stable-diffusion' : 'internal';
        throw new Error(`${error.message} (type: ${errorType})`);
      }
      console.warn(`Fetch attempt ${attempt} failed: ${error.message}. Retrying in ${retryDelay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
  throw new Error(`Fetch failed after ${retries} attempts`);
}

// Function to generate images for a given chapter
async function generateImagesForChapter(promptData: PromptData): Promise<void> {
  const { chapter, positive_prompt, negative_prompt } = promptData;
  console.log(chapter.replace('Genesis ', ''));
  const theChapter = parseInt(chapter.replace('Genesis ', ''));
  if (theChapter <= skipChapters) {
    console.log(`Skipping ${chapter}`);
    return;
  }
  // Prepare the base payload for the Stable Diffusion API
  const basePayload: StableDiffusionPayload = {
    prompt: positive_prompt,
    negative_prompt: negative_prompt,
    steps: 50, // Number of sampling steps
    cfg_scale: 7.5, // Classifier-free guidance scale
    width: 1024, // Image width
    height: 1024, // Image height
    sampler_name: "DPM++ 2M", // Sampler
    batch_size: batchSize, // Fixed at 1
    seed: -1, // Random seed for variety
    enable_hr: false, // Disable high-res for faster generation
  };

  // Create a directory for this chapter's images
  const chapterDir: string = chapter.replace(" ", "_").toLowerCase();
  await mkdirp(`illustrations/${chapterDir}`); // Create directory using mkdirp

  let totalImagesGenerated: number = 0;

  // Generate images in batches (1 image per batch) until we reach imagesPerChapter
  for (let batch = 1; batch <= batchesPerChapter; batch++) {
    const payload: StableDiffusionPayload = {
      ...basePayload,
      batch_size: batchSize, // Always 1
    };

    console.log(`Generating batch ${batch}/${batchesPerChapter} for ${chapter} (1 image)...`);

    // Set a custom timeout of 3000 seconds (3,000,000 milliseconds)
    const timeoutSignal = AbortSignal.timeout(3000000);

    // Start the image generation request without awaiting
    const fetchPromise = fetchWithRetries(apiEndpoint, {
      method: "POST",
      signal: timeoutSignal,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Poll progress while the request is processing
    let progress = 0;
    let eta: number | null = null;
    let error: string | undefined = undefined;
    let errorType: 'stable-diffusion' | 'internal' | undefined = undefined;
    let completed = false;
    const startTime = Date.now();
    const maxPollingDuration = 3000000; // 3000 seconds, matching the fetch timeout
    while (progress < 1 && !error && !completed) {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime > maxPollingDuration) {
        error = "Polling timed out after 3000 seconds";
        errorType = 'internal';
        break;
      }

      const progressData = await pollProgress(fetchPromise);
      progress = progressData.progress;
      eta = progressData.eta;
      error = progressData.error;
      errorType = progressData.errorType;
      completed = progressData.completed || false;

      if (error || completed) break; // Exit loop if an error or completion is detected
      process.stdout.write(`\rBatch ${batch}/${batchesPerChapter} for ${chapter}: ${createProgressBar(progress, eta)}`);
      if (progress >= 1) break; // Exit loop when generation is complete
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5 seconds
    }
    process.stdout.write("\n"); // New line after progress completes

    // Handle errors detected by the progress loop
    if (error) {
      // Always send the ntfy notification for any error
      await fetch('https://ntfy.andrepadez.com/mybiblebrother', {
        method: 'POST',
        body: `Illustrator process encountered an error: ${error}${errorType === 'stable-diffusion' ? '. Restarting Stable Diffusion.' : ''}`
      });

      console.error(`Error in batch ${batch} for ${chapter}: ${error} (type: ${errorType})`);

      // Only restart Stable Diffusion for server-side errors
      if (errorType === 'stable-diffusion') {
        console.log('Stable Diffusion error detected!', 'restarting Stable Diffusion server in 5 seconds');
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await $`/opt/homebrew/bin/pm2 restart "Stable Diffusion"`.text();
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        console.log('Internal/Bun error detected. Not restarting Stable Diffusion server. Retrying batch...');
      }
      batch--;
      continue;
    }

    // If no error, await the fetch response to get the images
    const response = await fetchPromise;

    const data: { images: string[] } = await response.json();

    // Save the single image in the batch (batchSize is 1)
    const imageBase64: string = data.images[0];
    const imageBuffer: Buffer = Buffer.from(imageBase64, "base64");

    // Generate a unique filename (e.g., genesis_1_001.png)
    const imageIndex: number = totalImagesGenerated + 1;
    const fileName: string = `illustrations/${chapterDir}/${chapterDir}_${String(imageIndex).padStart(3, "0")}.png`;
    await Bun.write(fileName, imageBuffer);

    totalImagesGenerated += 1;
    console.log(`Batch ${batch} for ${chapter} completed. Total images: ${totalImagesGenerated}/${imagesPerChapter}`);

    // Add a delay between batches to prevent resource exhaustion
    if (batch < batchesPerChapter) {
      console.log(`Waiting ${batchDelay / 1000} seconds before the next batch...`);
      await new Promise((resolve) => setTimeout(resolve, batchDelay));
    }
  }

  console.log(`Finished generating ${totalImagesGenerated} images for ${chapter}`);
}

// Loop through the prompts and generate images for each chapter
for (const prompt of prompts) {
  await generateImagesForChapter(prompt);
}

console.log("All images for all chapters generated!");
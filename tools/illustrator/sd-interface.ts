export type StableDiffusionPayload = {
  // Core prompt settings
  prompt: string; // The positive prompt describing the image
  negative_prompt?: string; // The negative prompt to exclude unwanted elements
  steps?: number; // Number of sampling steps (default: 50)
  cfg_scale?: number; // Classifier-free guidance scale (how closely the model follows the prompt, default: 7.5)

  // Image dimensions
  width?: number; // Width of the generated image (default: 512)
  height?: number; // Height of the generated image (default: 512)

  // Sampling method
  sampler_name?: string; // Name of the sampler (e.g., "Euler a", "DPM++ 2M Karras")
  sampler_index?: string; // Alternative to sampler_name (some APIs use this)

  // Advanced settings
  batch_size?: number; // Number of images to generate in one batch (default: 1)
  n_iter?: number; // Number of iterations (batches) to run (default: 1)
  seed?: number; // Seed for reproducibility (-1 for random)
  subseed?: number; // Subseed for variation
  subseed_strength?: number; // Strength of subseed variation (0 to 1)

  // Denoising and generation control
  denoising_strength?: number; // Denoising strength (used in img2img, 0 to 1)
  eta?: number; // Noise multiplier for certain samplers (e.g., DDIM)
  s_churn?: number; // Churn parameter for some samplers
  s_tmin?: number; // Minimum timestep for some samplers
  s_tmax?: number; // Maximum timestep for some samplers
  s_noise?: number; // Noise scale for some samplers

  // Style and model settings
  styles?: string[]; // List of styles to apply (if supported by your API)
  enable_hr?: boolean; // Enable high-resolution generation
  hr_scale?: number; // High-resolution scale factor (e.g., 2 for 2x upscaling)
  hr_upscaler?: string; // Upscaler method for high-res (e.g., "Latent", "ESRGAN_4x")
  hr_second_pass_steps?: number; // Steps for the second pass in high-res
  hr_resize_x?: number; // Resize width for high-res
  hr_resize_y?: number; // Resize height for high-res

  // ControlNet and other extensions (if enabled)
  alwayson_scripts?: Record<string, any>; // Scripts like ControlNet, if enabled
  controlnet_units?: Array<{
    input_image?: string; // Base64-encoded image for ControlNet
    module?: string; // ControlNet module (e.g., "canny")
    model?: string; // ControlNet model (e.g., "control_sd15_canny")
    weight?: number; // Weight of the ControlNet influence
    resize_mode?: string; // Resize mode for the input image
    lowvram?: boolean; // Low VRAM mode
    processor_res?: number; // Processor resolution
    threshold_a?: number; // Threshold A for the module
    threshold_b?: number; // Threshold B for the module
    guidance_start?: number; // Guidance start (0 to 1)
    guidance_end?: number; // Guidance end (0 to 1)
  }>;

  // Other options
  restore_faces?: boolean; // Restore faces (if face restoration is enabled)
  tiling?: boolean; // Enable tiling for seamless patterns
  do_not_save_samples?: boolean; // Prevent saving samples to disk
  do_not_save_grid?: boolean; // Prevent saving grid to disk
  override_settings?: Record<string, any>; // Override specific settings
  override_settings_restore_afterwards?: boolean; // Restore settings after generation
}

export type PromptData = {
  chapter: string;
  positive_prompt: string;
  negative_prompt: string;
}
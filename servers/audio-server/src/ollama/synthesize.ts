const { AUDIO_SERVER_URL } = import.meta.env;


export const synth = async (text: string, voice: string, speed: number) => {
  try {
    const result = await fetch(`${AUDIO_SERVER_URL}/tts`, {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.8",
        // "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryL6e2mv0qkI5aWBAs",
        "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Brave\";v=\"133\", \"Chromium\";v=\"133\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "cookie": "NEXT_LOCALE=en; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIwZTdhMDFmLWIwMjItNDZjZi1iZjdhLWQ4ZmYwMzU1YWI4MSJ9.CblzSRvfQlUxVZGd08aVHpqbD7bRAJLON8XXpbV5Py0",
        "Referer": "http://localhost:3333/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": getBody(text, voice, speed),
      "method": "POST"
    });
    const data: any = await result.json()
    return data.filename;
  } catch (ex) {
    console.log('Error in synth', ex);
    // await fetch('https://ntfy.andrepadez.com/mlx-audio', {
    //   method: 'POST', // PUT works too
    //   body: 'Macbook synth process has crashed'
    // });
  }
}

const getBody = (text: string, voice: string, speed: number) => {
  const formData = new FormData();
  formData.append("text", `\n\n${text}`);
  formData.append("voice", voice);
  formData.append("model", "mlx-community/Kokoro-82M-bf16");
  formData.append("speed", "" + speed);
  return formData;
}
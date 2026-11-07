import Meeting from "../models/Meeting.js";

const AI_TRANSLATION_URL = process.env.AI_TRANSLATION_URL || "http://localhost:8001";

/**
 * Check health / status of the Python SeamlessM4T translation service
 */
export async function getTranslationStatus(req, res, next) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${AI_TRANSLATION_URL}/health`, {
      signal: controller.signal,
    }).catch(() => null);
    clearTimeout(timeout);

    if (!response || !response.ok) {
      return res.json({
        success: true,
        data: {
          online: false,
          model: "SeamlessM4T-v2",
          languages: ["ben", "eng"],
          message: "AI translation service is offline or starting up.",
        },
      });
    }

    const data = await response.json().catch(() => ({}));
    return res.json({
      success: true,
      data: {
        online: true,
        model: data.model || "facebook/seamless-m4t-v2-large",
        device: data.device || "cpu",
        languages: ["ben", "eng"],
        ready: data.ready ?? true,
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Proxy translation request to the Python SeamlessM4T service
 */
export async function translateAudio(req, res, next) {
  try {
    const { tgt_lang = "eng", src_lang } = req.query;
    const meetingId = req.headers["x-meeting-id"];

    if (meetingId) {
      const meeting = await Meeting.findOne({
        meetingId,
        status: { $ne: "ended" },
        participants: req.user._id,
      }).select("_id");
      if (!meeting) {
        return res.status(403).json({ success: false, message: "Join this meeting before translating." });
      }
    }

    // Forward raw audio stream or buffer directly to Python FastAPI service
    const targetUrl = new URL(`${AI_TRANSLATION_URL}/translate`);
    targetUrl.searchParams.set("tgt_lang", tgt_lang);
    if (src_lang) targetUrl.searchParams.set("src_lang", src_lang);

    const contentType = req.headers["content-type"] || "audio/wav";
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(400).json({ success: false, message: "Empty audio buffer received." });
    }

    const aiResponse = await fetch(targetUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": contentType,
      },
      body: audioBuffer,
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text().catch(() => "AI translation failed");
      return res.status(aiResponse.status).json({
        success: false,
        message: `Translation service error: ${errorText}`,
      });
    }

    const outputBuffer = await aiResponse.arrayBuffer();
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Length", outputBuffer.byteLength);
    return res.send(Buffer.from(outputBuffer));
  } catch (error) {
    return next(error);
  }
}

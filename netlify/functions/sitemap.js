// netlify/functions/sitemap.js
const admin = require("firebase-admin");

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();
const BASE_URL = "https://moderntechgraphics.africa";

exports.handler = async function () {
  try {
    const now = new Date().toISOString();

    const staticUrls = [
      { loc: `${BASE_URL}/`, priority: "1.0" },
      { loc: `${BASE_URL}/about`, priority: "0.8" },
      { loc: `${BASE_URL}/contact`, priority: "0.8" },
    ];

    const snapshot = await db.collection("products").get();
    const productUrls = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const slug = `${slugify(data.name || "")}-${docSnap.id}`;
      return { loc: `${BASE_URL}/product/${slug}`, priority: "0.7" };
    });

    const allUrls = [...staticUrls, ...productUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `<url>
<loc>${u.loc}</loc>
<lastmod>${now}</lastmod>
<changefreq>daily</changefreq>
<priority>${u.priority}</priority>
</url>`
  )
  .join("\n")}
</urlset>`;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=600, s-maxage=600",
      },
      body: xml,
    };
  } catch (err) {
    console.error("Sitemap generation failed:", err);
    return {
      statusCode: 500,
      body: "Error generating sitemap",
    };
  }
};
const https = require("https");
const http = require("http");

const CHANNELS = {
  "62": "beIN SPORTS 1 Turkey",
  "63": "beIN SPORTS 2 Turkey",
  "64": "beIN SPORTS 3 Turkey",
  "67": "beIN SPORTS 4 Turkey",
  "1010": "beIN SPORTS 5 Turkey",
  "61": "beIN Sports MENA English 1",
  "90": "beIN Sports MENA English 2",
  "91": "beIN Sports 1 Arabic",
  "92": "beIN Sports 2 Arabic",
  "93": "beIN Sports 3 Arabic",
  "94": "beIN Sports 4 Arabic",
  "95": "beIN Sports 5 Arabic",
  "96": "beIN Sports 6 Arabic",
  "97": "beIN Sports 7 Arabic",
  "98": "beIN Sports 8 Arabic",
  "99": "beIN Sports 9 Arabic",
  "100": "beIN SPORTS XTRA 1",
  "116": "beIN SPORTS 1 France",
  "117": "beIN SPORTS 2 France",
  "118": "beIN SPORTS 3 France",
  "494": "beIN Sports MAX 4 France",
  "495": "beIN Sports MAX 5 France",
  "496": "beIN Sports MAX 6 France",
  "497": "beIN Sports MAX 7 France",
  "498": "beIN Sports MAX 8 France",
  "499": "beIN Sports MAX 9 France",
  "500": "beIN Sports MAX 10 France",
  "425": "beIN SPORTS USA",
  "372": "beIN SPORTS en Espanol",
  "578": "beIN Sports HD Qatar",
  "597": "beIN SPORTS MAX AR",
  "491": "beIN SPORTS Australia 1",
  "492": "beIN SPORTS Australia 2",
  "493": "beIN SPORTS Australia 3",
  "712": "beIN Sports 1 Malaysia",
  "713": "beIN Sports 2 Malaysia",
  "714": "beIN Sports 3 Malaysia",
  "889": "TRT Spor Turkey",
  "1011": "A Spor Turkey",
  "31": "TNT Sports 1 UK",
  "32": "TNT Sports 2 UK",
  "33": "TNT Sports 3 UK",
  "34": "TNT Sports 4 UK",
  "35": "Sky Sports Football UK",
  "38": "Sky Sports Main Event UK",
  "60": "Sky Sports F1 UK",
  "65": "Sky Sports Cricket UK",
  "70": "Sky Sports Golf UK",
  "366": "Sky Sports News UK",
  "449": "Sky Sports MIX UK",
  "554": "Sky Sports Racing UK",
  "230": "DAZN 1 UK",
  "451": "Viaplay Sports 1 UK",
  "39": "Fox Sports 1 USA",
  "44": "ESPN USA",
  "45": "ESPN2 USA",
  "66": "TUDN USA",
  "308": "CBS Sports Network USA",
  "318": "GOLF Channel USA",
  "399": "MLB Network USA",
  "404": "NBA TV USA",
  "405": "NFL Network USA",
  "667": "NFL RedZone USA",
  "376": "WWE Network USA",
  "240": "Sky Sports 1 DE",
  "241": "Sky Sports 2 DE",
  "556": "Sky Sport Top Event DE",
  "557": "Sky Sport Mix DE",
  "558": "Sky Sport Bundesliga 1 DE",
  "571": "SportDigital Fussball DE",
  "641": "Sport1 Germany",
  "426": "DAZN 1 Bar DE",
  "427": "DAZN 2 Bar DE",
  "119": "RMC Sport 1 France",
  "120": "RMC Sport 2 France",
  "122": "Canal+ Sport France",
  "271": "Canal+ MotoGP France",
  "460": "Sky Sport MAX Italy",
  "461": "Sky Sport UNO Italy",
  "462": "Sky Sport Arena Italy",
  "870": "Sky Sport Calcio Italy",
  "577": "Sky Sport F1 Italy",
  "869": "Sky Sport 24 Italy",
  "878": "EuroSport 1 Italy",
  "879": "EuroSport 2 Italy",
  "882": "Rai Sport Italy",
  "84": "Movistar LaLiga Spain",
  "445": "DAZN 1 Spain",
  "446": "DAZN 2 Spain",
  "524": "EuroSport 1 Spain",
  "525": "EuroSport 2 Spain",
  "537": "DAZN F1 Spain",
  "538": "DAZN LaLiga Spain",
  "528": "Movistar Golf Spain",
  "49": "Sport TV1 Portugal",
  "74": "Sport TV2 Portugal",
  "454": "Sport TV3 Portugal",
  "455": "Eleven Sports 1 Portugal",
  "456": "Eleven Sports 2 Portugal",
  "47": "Polsat Sport Poland",
  "48": "Canal+ Sport Poland",
  "50": "Polsat Sport 2 Poland",
  "57": "EuroSport 1 Poland",
  "58": "EuroSport 2 Poland",
  "129": "Polsat Sport 3 Poland",
  "78": "SporTV Brasil",
  "79": "SporTV2 Brasil",
  "80": "SporTV3 Brasil",
  "81": "ESPN Brasil",
  "82": "ESPN2 Brasil",
  "83": "ESPN3 Brasil",
  "88": "Premier Brasil",
  "149": "ESPN Argentina",
  "150": "ESPN2 Argentina",
  "387": "ESPN Premium Argentina",
  "388": "TNT Sports Argentina",
  "925": "ESPN 1 Mexico",
  "929": "Fox Sports 1 Mexico",
  "935": "TUDN Mexico",
  "41": "EuroSport 1 Greece",
  "42": "EuroSport 2 Greece",
  "631": "Nova Sports 1 Greece",
  "632": "Nova Sports 2 Greece",
  "599": "Nova Sports Premier League Greece",
  "101": "Sport Klub 1 Croatia",
  "102": "Sport Klub 2 Croatia",
  "103": "Sport Klub 3 Croatia",
  "453": "Sport Klub HD Croatia",
  "134": "Arena Sport 1 Premium",
  "135": "Arena Sport 2 Premium",
  "429": "Arena Sport 1 Serbia",
  "430": "Arena Sport 2 Serbia",
  "432": "Arena Sport 1 Croatia",
  "433": "Arena Sport 2 Croatia",
  "472": "Max Sport 1 Bulgaria",
  "465": "Diema Sport 1 Bulgaria",
  "466": "Diema Sport 2 Bulgaria",
  "600": "Abu Dhabi Sports 1 UAE",
  "601": "Abu Dhabi Sports 2 UAE",
  "609": "Abu Dhabi Sports 1 Premium",
  "604": "Dubai Sports 1 UAE",
  "605": "Dubai Sports 2 UAE",
  "606": "Dubai Sports 3 UAE",
  "614": "SSC Sport 1",
  "615": "SSC Sport 2",
  "619": "SSC Sport Extra 1",
  "781": "Alkass One",
  "782": "Alkass Two",
  "123": "Astro SuperSport 1",
  "124": "Astro SuperSport 2",
  "125": "Astro SuperSport 3",
  "267": "Star Sports 1 India",
  "269": "A Sport Pakistan",
  "450": "PTV Sports Pakistan",
  "820": "FOX Sports 502 Australia",
  "587": "Sky Sport Select NZ",
  "588": "Sky Sport 1 NZ",
  "808": "TV2 Sport X Denmark",
  "810": "TV2 Sport Denmark",
  "812": "TV 2 Sport Norway",
  "703": "TV4 Sport Live 1 Sweden"
};

const CATALOGS = {
  "bein-sports": ["62", "63", "64", "67", "1010", "61", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100", "116", "117", "118", "494", "495", "496", "497", "498", "499", "500", "425", "372", "578", "597", "491", "492", "493", "712", "713", "714"],
  "canli-sport": ["62", "63", "64", "67", "1010", "889", "1011", "31", "32", "33", "34", "35", "38", "60", "65", "70", "366", "449", "554", "230", "451", "39", "44", "45", "66", "308", "318", "399", "404", "405", "667", "376", "240", "241", "556", "557", "558", "571", "641", "426", "427", "119", "120", "122", "271", "460", "461", "462", "870", "577", "869", "878", "879", "882", "84", "445", "446", "524", "525", "537", "538", "528", "49", "74", "454", "455", "456", "47", "48", "50", "57", "58", "129", "78", "79", "80", "81", "82", "83", "88", "149", "150", "387", "388", "925", "929", "935", "41", "42", "631", "632", "599", "101", "102", "103", "453", "134", "135", "429", "430", "432", "433", "472", "465", "466", "600", "601", "609", "604", "605", "606", "614", "615", "619", "781", "782", "123", "124", "125", "267", "269", "450", "820", "587", "588", "808", "810", "812", "703"]
};

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36";

function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(url, { headers: { "User-Agent": UA, ...headers } }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    req.on("error", reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error("timeout")); });
  });
}

const manifest = {
  id: "app.justemir.sport",
  name: "Justemir Sport",
  version: "1.0.0",
  description: "Canli spor kanallari (beIN SPORTS odakli) - DLHD + SwarmCloud backend",
  logo: "https://dlive.sx/assets/logos/logo.png",
  resources: [
    { name: "catalog", types: ["channel"], idPrefixes: ["jss"] },
    { name: "meta", types: ["channel"], idPrefixes: ["jss"] },
    { name: "stream", types: ["channel"], idPrefixes: ["jss"] }
  ],
  types: ["channel"],
  idPrefixes: ["jss"],
  catalogs: [
    { id: "bein-sports", name: "beIN Sports", type: "channel", extra: [{ name: "search", isRequired: false }] },
    { id: "canli-sport", name: "Canli Spor Kanallari", type: "channel", extra: [{ name: "search", isRequired: false }] }
  ]
};

function handleCatalog(req, res, url) {
  const pathParts = url.pathname.split("/");
  const catalogId = pathParts[pathParts.length - 1].replace(".json", "");
  const search = url.searchParams.get("search") || "";
  
  let ids = CATALOGS[catalogId] || [];
  
  let items = ids.map((id) => ({
    id: `jss:${id}`,
    type: "channel",
    name: CHANNELS[id] || `Kanal ${id}`,
    poster: "https://dlive.sx/assets/logos/logo.png"
  }));
  
  if (search) {
    const q = search.toLowerCase();
    items = items.filter((item) => item.name.toLowerCase().includes(q));
  }
  
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ metas: items });
}

function handleMeta(req, res, url) {
  const pathParts = url.pathname.split("/");
  const id = pathParts[pathParts.length - 1].replace(".json", "");
  const chId = id.replace("jss:", "").replace(/[^0-9]/g, "");
  
  if (!chId || !CHANNELS[chId]) {
    res.setHeader("Content-Type", "application/json");
    res.status(404).json({ meta: null });
    return;
  }
  
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    meta: {
      id: `jss:${chId}`,
      type: "channel",
      name: CHANNELS[chId],
      poster: "https://dlive.sx/assets/logos/logo.png",
      description: "Canli spor kanali - " + CHANNELS[chId],
      genres: ["Spor", "Canli"]
    }
  });
}

function handleStream(req, res, url) {
  const pathParts = url.pathname.split("/");
  const id = pathParts[pathParts.length - 1].replace(".json", "");
  const chId = id.replace("jss:", "").replace(/[^0-9]/g, "");
  
  if (!chId) {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ streams: [] });
    return;
  }
  
  Promise.all([
    fetchUrl(`https://dembed.st/premiumtv/daddy.php?id=${chId}`, { Referer: "https://dlive.sx/" })
      .then((r) => {
        const m = r.body.match(/const\s+SRC\s*=\s*"([^"]+\.m3u8[^"]*)"/i);
        if (!m) throw new Error("SRC bulunamadi");
        return { name: "Justemir Sport - Sunucu 1 (DLHD)", url: m[1].replace(/\\\//g, "/"), headers: { "User-Agent": UA, Referer: "https://dembed.st/" } };
      })
      .catch(() => null),
    fetchUrl(`https://dlive.sx/cast/stream-${chId}.php`, { Referer: "https://dlive.sx/" })
      .then((r) => {
        const m = r.body.match(/tossequip\.net\/e\/([a-z0-9]+)/i);
        if (!m) throw new Error("tossequip slug bulunamadi");
        return m[1];
      })
      .then((slug) => fetchUrl(`https://tossequip.net/e/${slug}`, { Referer: "https://dlive.sx/" }))
      .then((r) => {
        const m = r.body.match(/window\._econfig='([^']+)'/);
        if (!m) throw new Error("_econfig bulunamadi");
        return { name: "Justemir Sport - Sunucu 2 (SwarmCloud)", url: m[1], headers: { "User-Agent": UA, Referer: "https://tossequip.net/" } };
      })
      .catch(() => null)
  ]).then((results) => {
    const streams = results.filter(Boolean).map((s) => ({
      title: CHANNELS[chId] || `Kanal ${chId}`,
      url: s.url,
      headers: s.headers
    }));
    
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ streams });
  });
}

module.exports = (req, res) => {
  const url = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  
  if (url.pathname === "/manifest.json") {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(manifest);
  } else if (url.pathname.startsWith("/catalog/")) {
    handleCatalog(req, res, url);
  } else if (url.pathname.startsWith("/meta/")) {
    handleMeta(req, res, url);
  } else if (url.pathname.startsWith("/stream/")) {
    handleStream(req, res, url);
  } else {
    res.status(404).json({ error: "Not found" });
  }
};

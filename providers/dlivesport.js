/**
 * dlivesport - Justemir Sport (Nuvio katalog saglayicisi)
 * =========================================================
 * Canli spor kanallari - kaynak: dlive.sx (DaddyLiveHD aynasi).
 * Odak: beIN SPORTS (TR / MENA / Arabic / France / USA / ...).
 *
 * Akis:
 *   Katalog item id : "jss:<kanalId>"   (ornek: jss:62 = beIN SPORTS 1 Turkey)
 *   getStreams("jss:62","movie") -> iki backend paralel denenir:
 *     Sunucu 1 (DLHD / dembed.st)     : /premiumtv/daddy.php?id=62 -> const SRC = "...m3u8"
 *     Sunucu 2 (SwarmCloud/tossequip) : dlive.sx/cast/stream-62.php -> /e/<slug>
 *         -> window._econfig (ozel base64 paketi) -> decode -> stream_url_nop2p
 *   Donen linkler canli HLS olup kisa omurludur; her oynatmada taze cozulur.
 *
 * Hermes-safe: async/await YOK, dis bagimlilik YOK, sadece Promise zincirleri.
 * Yeni kanal: CHANNELS'a ekle, ilgili CATALOGS listesine id yaz.
 */
(function () {
  "use strict";

  var TAG = "[dlivesport] ";
  var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36";
  var ID_PREFIX = "jss:";
  var TIMEOUT = 15000;

  // ------------------------------------------------------------------
  // KANALLAR (id = dlive.sx/watch.php?id=<id>)
  // ------------------------------------------------------------------
  var CHANNELS = {
    // beIN SPORTS Turkiye
    "62": "beIN SPORTS 1 Turkey",
    "63": "beIN SPORTS 2 Turkey",
    "64": "beIN SPORTS 3 Turkey",
    "67": "beIN SPORTS 4 Turkey",
    "1010": "beIN SPORTS 5 Turkey",
    // beIN SPORTS MENA / Arabic
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
    // beIN SPORTS France / diger
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
    // Turkiye diger
    "889": "TRT Spor Turkey",
    "1011": "A Spor Turkey",
    // Ingiltere
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
    // ABD
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
    // Almanya
    "240": "Sky Sports 1 DE",
    "241": "Sky Sports 2 DE",
    "556": "Sky Sport Top Event DE",
    "557": "Sky Sport Mix DE",
    "558": "Sky Sport Bundesliga 1 DE",
    "571": "SportDigital Fussball DE",
    "641": "Sport1 Germany",
    "426": "DAZN 1 Bar DE",
    "427": "DAZN 2 Bar DE",
    // Fransa ekstra / Italya
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
    // Ispanya
    "84": "Movistar LaLiga Spain",
    "445": "DAZN 1 Spain",
    "446": "DAZN 2 Spain",
    "524": "EuroSport 1 Spain",
    "525": "EuroSport 2 Spain",
    "537": "DAZN F1 Spain",
    "538": "DAZN LaLiga Spain",
    "528": "Movistar Golf Spain",
    // Portekiz / Polonya
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
    // Brezilya / Latin Amerika
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
    // Yunanistan / Balkanlar
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
    // Orta Dogu / Asya / Okyanusya / Iskandinavya
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

  // ------------------------------------------------------------------
  // KATALOGLAR (katalog id -> kanal id sirasi)
  // ------------------------------------------------------------------
  var CATALOGS = {
    "bein-sports": ["62", "63", "64", "67", "1010", "61", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100", "116", "117", "118", "494", "495", "496", "497", "498", "499", "500", "425", "372", "578", "597", "491", "492", "493", "712", "713", "714"],
    "canli-sport": ["62", "63", "64", "67", "1010", "889", "1011",
      "31", "32", "33", "34", "35", "38", "60", "65", "70", "366", "449", "554", "230", "451",
      "39", "44", "45", "66", "308", "318", "399", "404", "405", "667", "376",
      "240", "241", "556", "557", "558", "571", "641", "426", "427",
      "119", "120", "122", "271",
      "460", "461", "462", "870", "577", "869", "878", "879", "882",
      "84", "445", "446", "524", "525", "537", "538", "528",
      "49", "74", "454", "455", "456",
      "47", "48", "50", "57", "58", "129",
      "78", "79", "80", "81", "82", "83", "88",
      "149", "150", "387", "388", "925", "929", "935",
      "41", "42", "631", "632", "599",
      "101", "102", "103", "453", "134", "135", "429", "430", "432", "433", "472", "465", "466",
      "600", "601", "609", "604", "605", "606", "614", "615", "619", "781", "782",
      "123", "124", "125", "267", "269", "450", "820", "587", "588",
      "808", "810", "812", "703"]
  };

  // ------------------------------------------------------------------
  // HTTP yardimcilari
  // ------------------------------------------------------------------
  function fetchTimeout(url, options, timeout) {
    timeout = timeout || TIMEOUT;
    var timer = null;
    var p = new Promise(function (_, reject) {
      timer = setTimeout(function () { reject(new Error("zaman asimi: " + url)); }, timeout);
    });
    return Promise.race([fetch(url, options || {}), p]).then(function (r) {
      if (timer) clearTimeout(timer);
      return r;
    }, function (e) {
      if (timer) clearTimeout(timer);
      throw e;
    });
  }

  function pAll(list) {
    return Promise.all(list.map(function (p) {
      return Promise.resolve(p).then(
        function (v) { return { ok: true, v: v }; },
        function (e) { return { ok: false, e: e }; }
      );
    }));
  }

  function getText(url, headers) {
    return fetchTimeout(url, { headers: headers || {} }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status + " " + url);
      return r.text();
    });
  }

  // ------------------------------------------------------------------
  // Saf JS base64 + UTF-8 (Hermes ortaminda atob olmayabilir)
  // ------------------------------------------------------------------
  var B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  function bytesToStr(arr) {
    var out = "";
    for (var i = 0; i < arr.length; i += 8192) {
      out += String.fromCharCode.apply(null, arr.slice(i, i + 8192));
    }
    return out;
  }

  function b64ToBin(s) {
    s = String(s == null ? "" : s).replace(/[^A-Za-z0-9+\/=]/g, "");
    var out = [];
    for (var i = 0; i < s.length; i += 4) {
      var c1 = B64.indexOf(s.charAt(i));
      var c2 = B64.indexOf(s.charAt(i + 1));
      if (c1 < 0 || c2 < 0) continue;
      out.push((c1 << 2) | (c2 >> 4));
      var c3 = (s.charAt(i + 2) === "=") ? -1 : B64.indexOf(s.charAt(i + 2));
      if (c3 >= 0) {
        out.push(((c2 & 15) << 4) | (c3 >> 2));
        var c4 = (s.charAt(i + 3) === "=") ? -1 : B64.indexOf(s.charAt(i + 3));
        if (c4 >= 0) out.push(((c3 & 3) << 6) | c4);
      }
    }
    return bytesToStr(out);
  }

  function utf8Decode(bin) {
    var out = "", i = 0;
    while (i < bin.length) {
      var c = bin.charCodeAt(i++);
      if (c < 128) {
        out += String.fromCharCode(c);
      } else if (c > 191 && c < 224) {
        out += String.fromCharCode(((c & 31) << 6) | (bin.charCodeAt(i++) & 63));
      } else if (c > 223 && c < 240) {
        out += String.fromCharCode(((c & 15) << 12) | ((bin.charCodeAt(i++) & 63) << 6) | (bin.charCodeAt(i++) & 63));
      } else {
        var c2 = bin.charCodeAt(i++), c3 = bin.charCodeAt(i++), c4 = bin.charCodeAt(i++);
        var cp = (((c & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63)) - 65536;
        out += String.fromCharCode(55296 + (cp >> 10), 56320 + (cp & 1023));
      }
    }
    return out;
  }

  // tossequip _econfig cozucusu (stream.js icindeki algoritmanin aynisi):
  // base64 -> 4 parca -> her parcanin 4. karakterini at ->
  // parcalari [2,0,3,1] sirasiyla birlestir -> tekrar base64 -> JSON
  function decodeEconfig(enc) {
    var d1 = b64ToBin(enc);
    var size = Math.ceil(d1.length / 4);
    var order = [2, 0, 3, 1];
    var parts = ["", "", "", ""];
    for (var i = 0; i < 4; i++) {
      var chunk = d1.substr(i * size, size);
      if (chunk.length >= 5) chunk = chunk.substring(0, 3) + chunk.substring(4);
      parts[order[i]] = b64ToBin(chunk);
    }
    return JSON.parse(utf8Decode(b64ToBin(parts.join(""))));
  }

  // ------------------------------------------------------------------
  // Backend cozuculer
  // ------------------------------------------------------------------
  function resolveDembed(chId) {
    var url = "https://dembed.st/premiumtv/daddy.php?id=" + chId;
    return getText(url, { "User-Agent": UA, "Referer": "https://dlive.sx/" }).then(function (html) {
      var m = html.match(/const\s+SRC\s*=\s*"([^"]+\.m3u8[^"]*)"/i);
      if (!m) throw new Error("SRC bulunamadi");
      return {
        server: "Sunucu 1 (DLHD)",
        url: m[1].replace(/\\\//g, "/"),
        headers: { "User-Agent": UA, "Referer": "https://dembed.st/" }
      };
    });
  }

  function resolveTossequip(chId) {
    return getText("https://dlive.sx/cast/stream-" + chId + ".php",
        { "User-Agent": UA, "Referer": "https://dlive.sx/" })
      .then(function (html) {
        var m = html.match(/tossequip\.net\/e\/([a-z0-9]+)/i);
        if (!m) throw new Error("tossequip slug bulunamadi");
        return m[1];
      })
      .then(function (slug) {
        return getText("https://tossequip.net/e/" + slug,
          { "User-Agent": UA, "Referer": "https://dlive.sx/" });
      })
      .then(function (page) {
        var m = page.match(/window\._econfig='([^']+)'/);
        if (!m) throw new Error("_econfig bulunamadi");
        var cfg = decodeEconfig(m[1]);
        var src = cfg && (cfg.stream_url_nop2p || cfg.stream_url);
        if (!src) throw new Error("stream_url yok");
        return {
          server: "Sunucu 2 (SwarmCloud)",
          url: String(src).replace(/\\\//g, "/"),
          headers: { "User-Agent": UA, "Referer": "https://tossequip.net/" }
        };
      });
  }

  // ------------------------------------------------------------------
  // Nuvio API
  // ------------------------------------------------------------------
  function channelItem(chId) {
    return {
      id: ID_PREFIX + chId,
      name: CHANNELS[chId] || ("Kanal " + chId),
      type: "channel"
    };
  }

  function getCatalog(params) {
    params = params || {};
    var ids = CATALOGS[params.catalogId] || [];
    var items = [];
    for (var i = 0; i < ids.length; i++) items.push(channelItem(ids[i]));
    return Promise.resolve({ items: items });
  }

  function search(params) {
    var q = String((params && params.query) || "").toLowerCase().trim();
    if (!q) return Promise.resolve({ items: [] });
    var out = [];
    for (var k in CHANNELS) {
      if (CHANNELS.hasOwnProperty(k) && CHANNELS[k].toLowerCase().indexOf(q) >= 0) {
        out.push(channelItem(k));
        if (out.length >= 60) break;
      }
    }
    return Promise.resolve({ items: out });
  }

  function comments() { return { comments: [] }; }

  function getStreams(id, mediaType, season, episode) {
    var raw = String(id == null ? "" : id);
    if (raw.indexOf(ID_PREFIX) !== 0) return Promise.resolve([]);
    var chId = raw.slice(ID_PREFIX.length).replace(/[^0-9]/g, "");
    if (!chId) return Promise.resolve([]);
    var name = CHANNELS[chId] || ("Kanal " + chId);

    return pAll([resolveDembed(chId), resolveTossequip(chId)]).then(function (res) {
      var out = [];
      for (var i = 0; i < res.length; i++) {
        var r = res[i];
        if (!r || !r.ok || !r.v) continue;
        out.push({
          name: "Justemir Sport - " + r.v.server,
          title: name + "\nCANLI - " + r.v.server,
          url: r.v.url,
          quality: "LIVE",
          isM3u8: true,
          type: "hls",
          headers: r.v.headers,
          subtitles: [],
          provider: "dlivesport"
        });
      }
      console.log(TAG + name + " -> " + out.length + " yayin bulundu");
      return out;
    }, function (e) {
      console.log(TAG + " hata: " + (e && e.message));
      return [];
    });
  }

  var API = { getCatalog: getCatalog, getStreams: getStreams, search: search, comments: comments };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = API;
  } else {
    var G = (typeof globalThis !== "undefined") ? globalThis : this;
    G.getCatalog = getCatalog;
    G.getStreams = getStreams;
    G.search = search;
    G.comments = comments;
  }
})();

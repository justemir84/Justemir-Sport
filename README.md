# Justemir Sport 🏟️

Nuvio için **canlı spor kanalları** eklentisi (katalog + yayın).
Kaynak: [dlive.sx](https://dlive.sx) (DaddyLiveHD aynası) 24/7 kanalları.
Odak: **beIN SPORTS** + popüler dünya spor kanalları.

## Kurulum (Nuvio)

> ⚠️ **Önemli:** Yerel eklenti **katalogları** (Keşfet/ana ekran satırları) şu an yalnızca
> **NuvioTV-Test** sürümünde destekleniyor. Resmi NuvioTV / Nuvio sürümleri
> (1.0.0 kararlı **ve** 1.1.0-beta dahil) eklenti kataloglarını okumaz — repoyu eklesen bile
> kanallar listelenmez ve aramada çıkmaz (arama TMDB üzerinden çalışır).

1. **NuvioTV-Test APK'yı indir ve kur** (resmi uygulamayla *yan yana* kurulur, paket adı farklı):

   - arm64-v8a (çoğu Android TV / box): `https://github.com/manitux-app/NuvioTV-Test/releases/download/1.1.0-beta.7/app-full-arm64-v8a-release.apk`
   - Emin değilsen universal (tüm cihazlar): `https://github.com/manitux-app/NuvioTV-Test/releases/download/1.1.0-beta.7/app-full-universal-release.apk`
   - Tüm sürümler: `https://github.com/manitux-app/NuvioTV-Test/releases`

2. NuvioTV-Test → **Eklentiler / Repo ekle** bölümüne manifest linkini gir:
   `https://raw.githubusercontent.com/justemir84/Justemir-Sport/refs/heads/main/manifest.json`
3. **Justemir Sport** eklentisini etkinleştir.
4. Ana sayfada **beIN Sports** ve **Canlı Spor Kanalları** katalogları görünür.
   Kanala tıkla → sunucular listelenir → oynat.

> Kendi fork'unu kullanacaksan linkteki `justemir84/Justemir-Sport` kısmını değiştir.

## Kataloglar

| Katalog | İçerik |
|---|---|
| **beIN Sports** | beIN SPORTS 1-5 Türkiye, MENA English 1-2, Arabic 1-9, XTRA 1, Fransa (1-3 + MAX 4-10), USA, Avustralya 1-3, Malezya 1-3, Katar, MAX AR, Español (~38 kanal) |
| **Canlı Spor Kanalları** | TRT Spor, A Spor + beIN TR; TNT/Sky Sports, ESPN/NBA/NFL, Sky IT/DE, DAZN, Movistar, Sport TV, Polsat, SporTV, Arena Sport, Sport Klub, Nova, SSC, Abu Dhabi Sports, Astro, Star Sports, TV2... (~130 kanal) |

## Sunucular (nasıl çözülür?)

Her kanal için **iki backend paralel denenir**; çalışanlar liste olarak gösterilir:

| Sunucu | Kaynak | Yöntem |
|---|---|---|
| Sunucu 1 (DLHD) | `dembed.st` | Kanal sayfası HTML'indeki `const SRC = "...m3u8"` doğrudan alınır |
| Sunucu 2 (SwarmCloud) | `tossequip.net` | `window._econfig` özel base64 paketi çözülür → `stream_url_nop2p` m3u8 |

- Linkler **canlı HLS** olup kısa ömürlüdür (saatlik token). Bu yüzden her oynatmada yeniden üretilir — elle kaydetmeye gerek yoktur, kaydedilse de birkaç saat sonra ölür.
- dlive.sx'teki 4/5/6 numaralı alternatif sunucular (welovetocare/ksohls/wideiptv) bazı ağlardan erişilemediği için v1.0.0'da yoktur.

## Kanal ekleme

1. dlive.sx'te kanalı aç: `https://dlive.sx/watch.php?id=NN` (örn. `id=62`).
2. `providers/dlivesport.js` içindeki `CHANNELS` tablosuna ekle: `"NN": "Kanal Adı",`
3. Hangi katalogda görünsün istiyorsan `CATALOGS` listesine `"NN"` id'sini ekle.
4. Dosyayı kaydet/push et — eklenti otomatik güncellenir.

## Sık sorunlar

- **Keşfet'te katalog yok / aramada kanal çıkmıyor**: Resmi Nuvio sürümleri eklenti kataloglarını desteklemiyor — yukarıdaki NuvioTV-Test kurulumunu uygulayın.
- **"Yayın bulunamadı"**: Kanal o an yayında olmayabilir ya da her iki backend de bakımda olabilir; başka kanal deneyin.
- **Yayın açılmıyor**: Bazı kanallar bölgesel engellidir (VPN gerekebilir).
- **Sadece 1 sunucu görünüyor**: Diğer backend o an yanıt vermiyor demektir; sorun değil.

## Dosya yapısı

```
justemir-sport/
├── manifest.json
├── providers/
│   └── dlivesport.js
├── README.md
└── LICENSE
```

## Yayınlama (GitHub)

```bash
git init
git add .
git commit -m "Justemir Sport v1.0.0"
git branch -M main
git remote add origin https://github.com/justemir84/Justemir-Sport.git
git push -u origin main
```

## Yasal not

Bu eklenti içerik barındırmaz; yalnızca herkese açık kaynaklardaki yayın adreslerini çözer. Kişisel kullanım içindir. Yayın hakları ilgili kuruluşlara aittir.

## Lisans

MIT — bkz. [LICENSE](LICENSE)


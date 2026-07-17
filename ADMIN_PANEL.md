# Koku Vitrini Yönetim Paneli

Yönetim paneli `/yonetim` adresindedir. Bu sayfa arama motorlarına kapalıdır ve yalnızca Supabase `admin_users` tablosunda yetkili olan hesaplar yönetim verilerine erişebilir.

## İlk kullanım

1. Supabase üzerinde oluşturduğunuz yönetici e-posta ve parolasıyla giriş yapın.
2. **Genel Bakış** ekranındaki **Örnek kataloğu aktar** düğmesini bir kez kullanın.
3. Aktarılan ürünleri tek tek açarak gerçek ürün bilgileri ve fotoğraflarıyla güncelleyin.

## Ürün ekleme

1. **Ürünler → Yeni ürün** seçeneğini açın.
2. Ürün adı, marka, kategori, koku ailesi, boyut, fiyat ve stok bilgilerini doldurun.
3. Notaları, mevsimleri ve kullanım ortamlarını virgülle ayırarak yazın.
4. Özgün kısa açıklama ile ayrıntılı ürün açıklamasını tamamlayın.
5. Mümkünse SKU ve gerçek GTIN/EAN barkodunu girin. Bilmediğiniz kodu uydurmayın.
6. İlk kaydı **Taslak** olarak kaydedin.
7. Kayıttan sonra ürün görsellerini yükleyin ve birini **Kapak görseli** yapın.
8. SEO hazırlık puanındaki eksikleri tamamlayın ve ürünü **Yayında** durumuna alın.

## Görsel standardı

- Tercih edilen biçim: WebP veya yüksek kaliteli JPG
- Önerilen ölçü: kare, en az `1200 × 1200` piksel
- Dosya sınırı: görsel başına en fazla 5 MB
- Arka plan: temiz ve ürün rengini doğru gösteren nötr arka plan
- Alt metin: `Marka + ürün adı + boyut + ürün tipi`

## SEO için önemli kurallar

- Her ürünün açıklaması özgün olmalıdır; üretici metnini aynen kopyalamayın.
- SEO başlığını yaklaşık 35–65, SEO açıklamasını 120–165 karakter aralığında tutun.
- Ürün adında marka, model ve boyutun doğru olduğundan emin olun.
- Fiyat, stok, SKU ve barkod alanlarını yalnızca gerçek verilerle doldurun.
- Görsel alt metinlerini ürünle gerçekten eşleşecek biçimde yazın.
- Aynı ürünü farklı bağlantı adlarıyla çoğaltmayın.

## Güvenlik

- `.env.local` dosyasını GitHub'a yüklemeyin.
- Yalnızca `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` tarayıcı uygulamasında kullanılmalıdır.
- `service_role` anahtarını, veritabanı parolasını veya yönetici parolasını kaynak koda eklemeyin.
- Ayrılan ekip üyelerinin Supabase hesabını ve `admin_users` yetkisini kaldırın.

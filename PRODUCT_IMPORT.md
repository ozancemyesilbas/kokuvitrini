# Toplu ürün aktarımı

1. `data/urunler.csv` dosyasını Excel ile açın.
2. Her ürünü ayrı satıra girin. Birden fazla nota, mevsim veya kullanım alanını `|` işaretiyle ayırın.
3. Dosyayı UTF-8 CSV olarak kaydedin.
4. Aşağıdaki komutu çalıştırın:

```bash
npm run import:products -- data/urunler.csv
```

Komut zorunlu alanları kontrol eder ve `lib/imported-products.js` dosyasını üretir. Aktarılan ürün varsa site örnek kataloğun yerine gerçek ürünleri otomatik kullanır.

## Zorunlu alanlar

`name`, `brand`, `gender`, `family`, `size`, `price`, `stock`, `short`, `description`, `notes`, `seasons`, `occasions`, `intensity`

## Çoklu değer örneği

```text
Vanilya|Amber|Odunsu
Sonbahar|Kış
Akşam|Özel gün
```

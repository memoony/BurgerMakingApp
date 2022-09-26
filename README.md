# BurgerMaking

Bu proje, Angular CLI sürüm 13.1.2 ile oluşturulmuştur.

## Kurulum ve Projeyi Çalıştırma

İlk olarak `npm install` komutu çalıştırılarak gerekli paketlerin yüklenmesi sağlanmalıdır. Ardından `ng serve` komutu ile proje çalıştırılır ve `http://localhost:4200/` üzerinden görüntülenebilir.

## Proje Hk.

Proje tek bir sayfa üzerinden ilerlemektedir. Verilen malzeme listesindeki tüm malzemeler `Local Storage` üzerinde tutulmaktadır. İlk olarak `Yeni Sipariş` butonuna tıklanır. Bu aşamada gerekli malzeme kontrolleri yapıldıktan sonra ilgili sipariş formu ekrana gelecektir.

İlgili sipariş formundan et türü seçildikten sonra `Sipariş Hazırla` butonu üzerinden hamburger, patates ve içecek hazırlanmaktadır. Bu aşamadan sonra `Local Storage` üzerindeki malzeme miktarları güncellenmektedir.

Sipariş hazırlama işleminden sonra ekranda çıkacak olan `Sos ve Ürünleri Tepsiye Koy` butonu üzerinden ürünlerin tepsiye konulması sağlanmaktadır. Bu aşamadan sonra `Local Storage` üzerindeki sos miktarı da güncellenecektir.

Ürünler tepsiye konulduktan sonra ise ekranda çıkacak olan `Müşteriye Sipariş Et` butonu ile ürün müşteriye sipariş edilir. Uyarı mesajının ardından sayfa yenilenerek tekrar ilk adımdaki `Yeni Sipariş` butonunun bulunduğu adıma geçilir.

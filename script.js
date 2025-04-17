let karakter;
const karakterYaratmaEkrani = document.getElementById('karakter-yaratma-ekrani');
const oyunAlani = document.getElementById('oyun-alani');
const oyunMetniAlani = document.getElementById('oyun-metni');
const envanterListesi = document.getElementById('envanter');
const envanterAlani = document.getElementById('envanter-alani');
let mevcutOlay; // Mevcut olayı takip etmek için değişken

function karakterYarat() {
    const ad = document.getElementById('karakter-adi').value;
    const bina = document.getElementById('bina').value;
    const zeka = parseInt(document.getElementById('zeka').value);
    const cesaret = parseInt(document.getElementById('cesaret').value);
    const azim = parseInt(document.getElementById('azim').value);
    const wicca = parseInt(document.getElementById('wicca').value);

    karakter = {
        ad: ad,
        bina: bina,
        statlar: {
            zeka: zeka,
            cesaret: cesaret,
            azim: azim,
            wicca: wicca
        },
        envanter: ["Asa"],
        mevcutKonum: "King's Cross İstasyonu, Peron 9 ¾"
    };

    karakterYaratmaEkrani.style.display = 'none';
    oyunAlani.style.display = 'block';
    envanterAlani.style.display = 'block';

    oyunMetniAlani.innerHTML = `Adınız ${karakter.ad}. Hogwarts'a gitmek için sabırsızlanıyorsunuz. King's Cross İstasyonu'nda, duman ve uğultu arasında Peron 9 ¾'ü buldunuz. Kızıl renkli Hogwarts Ekspresi sizi bekliyor.<br><br>`;
    guncelleEnvanter();
    mevcutOlay = hogwartsEkspresineBinisOlayi;
    // İlk olayın metnini ve seçeneklerini doğrudan burada göster
    olay(mevcutOlay.metin, mevcutOlay.secenekler);
}

function guncelleEnvanter() {
    envanterListesi.innerHTML = '';
    karakter.envanter.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        envanterListesi.appendChild(li);
    });
}

function envantereEkle(item) {
    karakter.envanter.push(item);
    guncelleEnvanter();
}

function statKontrolu(stat, zorluk) {
    return karakter.statlar[stat] >= zorluk;
}

function olay(metin, secenekler) {
    oyunMetniAlani.innerHTML += `${metin}<br>`;
    secenekler.forEach((secenek, index) => {
        const button = document.createElement('button');
        button.textContent = secenek.metin;
        button.onclick = () => secimYap(index);
        oyunMetniAlani.appendChild(button);
    });
}

function secimYap(secimIndex) {
    const secilenSecenek = mevcutOlay.secenekler[secimIndex];
    oyunMetniAlani.innerHTML += `<br><br>${typeof secilenSecenek.sonuc === 'function' ? secilenSecenek.sonuc() : secilenSecenek.sonuc}<br><br>`;
    if (secilenSecenek.sonrakiOlay) {
        mevcutOlay = secilenSecenek.sonrakiOlay;
        const devamButton = document.createElement('button');
        devamButton.textContent = "Devam Et";
        devamButton.id = "devam-et-butonu"; // "Devam Et" butonuna ID eklendi
        devamButton.onclick = sonrakiOlayiGoster;
        oyunMetniAlani.appendChild(devamButton);
    } else {
        oyunMetniAlani.innerHTML += "<br>Hikayenin bu kısmı sona erdi.";
    }
    guncelleEnvanter();
}

function sonrakiOlayiGoster() {
    oyunMetniAlani.innerHTML = ''; // Önceki metni temizle
    if (mevcutOlay) {
        olay(mevcutOlay.metin, mevcutOlay.secenekler);
    } else {
        oyunMetniAlani.innerHTML = "Oyun sona erdi.";
    }
}

// --- Hogwarts Ekspresi Hikayesi (Kitaba Göre) ---

// Oyunun başlangıç olayı
const hogwartsEkspresineBinisOlayi = {
    metin: "King's Cross İstasyonu'nda Hogwarts Ekspresi'ni arıyorsunuz. 9 ¾ peronunu buldunuz ve trene bindiniz.",
    secenekler: [
        {
            metin: "Boş bir kompartıman ara",
            sonuc: "Koridorda ilerliyorsunuz...",
            sonrakiOlay: kompartimanSecimiOlayi
        }
    ]
};

const kompartimanSecimiOlayi = {
    metin: "Hogwarts Ekspresi'nde ilerliyorsunuz. Birçok kompartıman dolu görünüyor.",
    secenekler: [
        {
            metin: "Boş gibi görünen bir kompartımana gir",
            sonuc: "İçeride kızıl saçlı, burnunda bir leke olan bir çocuk oturuyor. Yanında da yuvarlak yüzlü, alnında şimşek şeklinde bir yara izi olan başka bir çocuk var.",
            sonrakiOlay: harryRonIleTanismaOlayi
        },
        {
            metin: "Dolu olsa bile bir kompartımanın kapısını çal",
            sonuc: "Birkaç denemeden sonra, içinde sadece tombul bir çocuğun olduğu bir kompartıman buldunuz.",
            sonrakiOlay: nevilleIleTanismaOlayi
        }
    ]
};

const harryRonIleTanismaOlayi = {
    metin: "Kızıl saçlı çocuk size dönerek, 'Merhaba, ben Ron Weasley,' dedi. Yanındaki çocuk da, 'Ben de Harry Potter,' diye ekledi.",
    secenekler: [
        {
            metin: "Kendini tanıt",
            sonuc: "'Merhaba, ben de ${karakter.ad}.'",
            sonrakiOlay: treneYiyecekGelmesiOlayi
        },
        {
            metin: "Sadece gülümse",
            sonuc: "Onlara gülümsediniz.",
            sonrakiOlay: treneYiyecekGelmesiOlayi
        }
    ]
};

const nevilleIleTanismaOlayi = {
    metin: "Tombul çocuk size gülümseyerek, 'Ben Neville Longbottom,' dedi. Elinde bir kurbağa tutuyor.",
    secenekler: [
        {
            metin: "Merhaba, ben de ${karakter.ad}.",
            sonuc: "Neville size kurbağası Trevor'ı gösterdi.",
            sonrakiOlay: treneYiyecekGelmesiOlayi
        },
        {
            metin: "Kurbağaya ilginç bir bakış at",
            sonuc: "Neville kurbağasını daha sıkı tuttu.",
            sonrakiOlay: treneYiyecekGelmesiOlayi
        }
    ]
};

const treneYiyecekGelmesiOlayi = {
    metin: "Kompartımanın kapısı açıldı ve tekerlekli bir arabayla bir cadı içeri girdi. 'Tatlılar? Turtalar?'",
    secenekler: [
        {
            metin: "Birkaç Cauldron Cake al",
            sonuc: "Lezzetli Cauldron Cake'lerden aldınız.",
            sonrakiOlay: trollMuhabbetiOlayi
        },
        {
            metin: "Kabaklı Turta al",
            sonuc: "Sıcak bir kabaklı turta aldınız.",
            sonrakiOlay: trollMuhabbetiOlayi
        },
        {
            metin: "Hiçbir şey alma",
            sonuc: "Şimdilik bir şey almıyorsunuz.",
            sonrakiOlay: trollMuhabbetiOlayi
        }
    ]
};

const trollMuhabbetiOlayi = {
    metin: "Ron, ailesinin daha önce karşılaştığı bir dağ trolünden bahsediyor. Harry biraz endişeli görünüyor.",
    secenekler: [
        {
            metin: "Trol hikayesine yorum yap",
            sonuc: () => {
                if (statKontrolu("cesaret", 12)) {
                    return "'Korkutucu olmalı,' dedin sakince.";
                } else {
                    return "Hafifçe ürperdin.";
                }
            },
            sonrakiOlay: hogwartsVarisOlayi
        },
        {
            metin: "Sessiz kal",
            sonuc: "Sessizce onları dinliyorsun.",
            sonrakiOlay: hogwartsVarisOlayi
        }
    ]
};

const hogwartsVarisOlayi = {
    metin: "Tren yavaşlıyor. Camlardan Hogwarts'ın kuleleri görünüyor!",
    secenekler: [
        {
            metin: "Eşyalarını topla",
            sonuc: "Heyecanla eşyalarını topluyorsun.",
            sonrakiOlay: kayiklaraGecisOlayi
        }
    ]
};

const kayiklaraGecisOlayi = {
    metin: "Trenden indikten sonra Hagrid'in sesini duyuyorsunuz: 'Birinci sınıf öğrencileri! Buraya gelin!' Sizi gölün kıyısında bekleyen küçük kayıklara doğru yönlendiriyor.",
    secenekler: [
        {
            metin: "Bir kayığa bin",
            sonuc: "Üç ya da dört öğrenciyle birlikte bir kayığa bindiniz.",
            sonrakiOlay: buyukSalonOlayi
        }
    ]
};

const buyukSalonOlayi = {
    metin: "Kayıklar sizi Hogwarts'ın altındaki bir mağaradan geçiriyor ve sonunda Büyük Salon'un büyülü atmosferine ulaşıyorsunuz. Tavanda binlerce mum yüzüyor ve dört bina masası boyunca öğrenciler sıralanmış.",
    secenekler: [
        {
            metin: "Etrafına bak",
            sonuc: "Büyülenmiş bir şekilde etrafınıza bakıyorsunuz.",
            sonrakiOlay: siralamaToreniOlayi
        }
    ]
};

const siralamaToreniOlayi = {
    metin: "Profesör McGonagall elinde bir parşömenle geldi. 'Adınızı okuduğumda öne gelip Seçmen Şapka'yı takacaksınız,' dedi.",
    secenekler: [
        {
            metin: "Adının okunmasını bekle",
            sonuc: "Sıranızı bekliyorsunuz...",
            sonrakiOlay: null // Burada sıralama töreni ve binanıza göre devam eden hikaye dallanacak.
        }
    ]
};

function sonrakiOlayiGoster() {
    oyunMetniAlani.innerHTML = ''; // Önceki metni temizle
    if (mevcutOlay) {
        olay(mevcutOlay.metin, mevcutOlay.secenekler);
    } else {
        oyunMetniAlani.innerHTML = "Oyun sona erdi.";
    }
}

// Oyunu başlat
// İlk olayın metnini ve seçeneklerini doğrudan karakter yaratıldıktan sonra gösteriyoruz.
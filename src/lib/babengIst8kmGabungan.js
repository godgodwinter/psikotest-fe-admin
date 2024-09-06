export const fn_settings_range_8km = (umur, jenis, nilai) => {
  let hasil = {
    singkatan: "-",
    keterangan: "Angka tidak valid!",
  };
  if (jenis == "kb") {
    hasil = fn_range_iq_kb(umur, jenis, nilai);
  } else if (jenis == "kl") {
    hasil = fn_range_iq_kb(umur, jenis, nilai);
    // kl kebawah setingrangenya sama
  } else {
    hasil = fn_range_iq_kn(umur, jenis, nilai);
  }
  return hasil;
};

export const fn_range_iq_ttl = (umur, jenis, nilai) => {
  let hasil = {
    singkatan: "-",
    keterangan: "Angka tidak valid!",
  };
  if (nilai >= 84) {
    hasil = {
      singkatan: "SBS",
      keterangan: "Sangat Baik Sekali",
    };
  } else if (84 > nilai && nilai >= 76) {
    hasil = {
      singkatan: "BS",
      keterangan: "Baik Sekali",
    };
  } else if (76 > nilai && nilai >= 67) {
    hasil = {
      singkatan: "B",
      keterangan: "Baik ",
    };
  } else if (67 > nilai && nilai >= 59) {
    hasil = {
      singkatan: "CB",
      keterangan: "Cukup Baik ",
    };
  } else if (59 > nilai && nilai >= 42) {
    hasil = {
      singkatan: "C",
      keterangan: "Cukup",
    };
  } else if (42 > nilai && nilai >= 34) {
    hasil = {
      singkatan: "HC",
      keterangan: "Hampir Cukup",
    };
  } else if (34 > nilai && nilai >= 26) {
    hasil = {
      singkatan: "K",
      keterangan: "Kurang",
    };
  } else if (26 > nilai && nilai >= 17) {
    hasil = {
      singkatan: "KS",
      keterangan: "Kurang Sekali",
    };
  } else {
    hasil = {
      singkatan: "SKS",
      keterangan: "Sangat Kurang Sekali",
    };
  }
  return hasil;
};

export const fn_range_iq_kb = (umur, jenis, nilai) => {
  let hasil = {
    singkatan: "-",
    keterangan: "Angka tidak valid!",
  };
  if (nilai >= 85) {
    hasil = {
      singkatan: "SBS",
      keterangan: "Sangat Baik Sekali",
    };
  } else if (85 > nilai && nilai >= 78) {
    hasil = {
      singkatan: "BS",
      keterangan: "Baik Sekali",
    };
  } else if (78 > nilai && nilai >= 70) {
    hasil = {
      singkatan: "B",
      keterangan: "Baik ",
    };
  } else if (70 > nilai && nilai >= 60) {
    hasil = {
      singkatan: "CB",
      keterangan: "Cukup Baik ",
    };
  } else if (60 > nilai && nilai >= 45) {
    hasil = {
      singkatan: "C",
      keterangan: "Cukup",
    };
  } else if (45 > nilai && nilai >= 35) {
    hasil = {
      singkatan: "HC",
      keterangan: "Hampir Cukup",
    };
  } else if (35 > nilai && nilai >= 28) {
    hasil = {
      singkatan: "K",
      keterangan: "Kurang",
    };
  } else if (28 > nilai && nilai >= 20) {
    hasil = {
      singkatan: "KS",
      keterangan: "Kurang Sekali",
    };
  } else {
    hasil = {
      singkatan: "SKS",
      keterangan: "Sangat Kurang Sekali",
    };
  }
  return hasil;
};

export const fn_range_iq_kl = (umur, jenis, nilai) => {
  let hasil = {
    singkatan: "-",
    keterangan: "Angka tidak valid!",
  };
  if (nilai >= 86) {
    hasil = {
      singkatan: "SBS",
      keterangan: "Sangat Baik Sekali",
    };
  } else if (86 > nilai && nilai >= 78) {
    hasil = {
      singkatan: "BS",
      keterangan: "Baik Sekali",
    };
  } else if (78 > nilai && nilai >= 68) {
    hasil = {
      singkatan: "B",
      keterangan: "Baik ",
    };
  } else if (68 > nilai && nilai >= 60) {
    hasil = {
      singkatan: "CB",
      keterangan: "Cukup Baik ",
    };
  } else if (60 > nilai && nilai >= 44) {
    hasil = {
      singkatan: "C",
      keterangan: "Cukup",
    };
  } else if (44 > nilai && nilai >= 36) {
    hasil = {
      singkatan: "HC",
      keterangan: "Hampir Cukup",
    };
  } else if (36 > nilai && nilai >= 28) {
    hasil = {
      singkatan: "K",
      keterangan: "Kurang",
    };
  } else if (28 > nilai && nilai >= 18) {
    hasil = {
      singkatan: "KS",
      keterangan: "Kurang Sekali",
    };
  } else {
    hasil = {
      singkatan: "SKS",
      keterangan: "Sangat Kurang Sekali",
    };
  }
  return hasil;
};

export const fn_range_iq_ks = (umur, jenis, nilai) => {
  let hasil = {
    singkatan: "-",
    keterangan: "Angka tidak valid!",
  };
  if (nilai >= 86) {
    hasil = {
      singkatan: "SBS",
      keterangan: "Sangat Baik Sekali",
    };
  } else if (86 > nilai && nilai >= 78) {
    hasil = {
      singkatan: "BS",
      keterangan: "Baik Sekali",
    };
  } else if (78 > nilai && nilai >= 68) {
    hasil = {
      singkatan: "B",
      keterangan: "Baik ",
    };
  } else if (68 > nilai && nilai >= 60) {
    hasil = {
      singkatan: "CB",
      keterangan: "Cukup Baik ",
    };
  } else if (60 > nilai && nilai >= 44) {
    hasil = {
      singkatan: "C",
      keterangan: "Cukup",
    };
  } else if (44 > nilai && nilai >= 36) {
    hasil = {
      singkatan: "HC",
      keterangan: "Hampir Cukup",
    };
  } else if (36 > nilai && nilai >= 28) {
    hasil = {
      singkatan: "K",
      keterangan: "Kurang",
    };
  } else if (28 > nilai && nilai >= 18) {
    hasil = {
      singkatan: "KS",
      keterangan: "Kurang Sekali",
    };
  } else {
    hasil = {
      singkatan: "SKS",
      keterangan: "Sangat Kurang Sekali",
    };
  }
  return hasil;
};

export const fn_range_iq_km = (umur, jenis, nilai) => {
  let hasil = {
    singkatan: "-",
    keterangan: "Angka tidak valid!",
  };
  if (nilai >= 86) {
    hasil = {
      singkatan: "SBS",
      keterangan: "Sangat Baik Sekali",
    };
  } else if (86 > nilai && nilai >= 78) {
    hasil = {
      singkatan: "BS",
      keterangan: "Baik Sekali",
    };
  } else if (78 > nilai && nilai >= 68) {
    hasil = {
      singkatan: "B",
      keterangan: "Baik ",
    };
  } else if (68 > nilai && nilai >= 60) {
    hasil = {
      singkatan: "CB",
      keterangan: "Cukup Baik ",
    };
  } else if (60 > nilai && nilai >= 44) {
    hasil = {
      singkatan: "C",
      keterangan: "Cukup",
    };
  } else if (44 > nilai && nilai >= 36) {
    hasil = {
      singkatan: "HC",
      keterangan: "Hampir Cukup",
    };
  } else if (36 > nilai && nilai >= 28) {
    hasil = {
      singkatan: "K",
      keterangan: "Kurang",
    };
  } else if (28 > nilai && nilai >= 18) {
    hasil = {
      singkatan: "KS",
      keterangan: "Kurang Sekali",
    };
  } else {
    hasil = {
      singkatan: "SKS",
      keterangan: "Sangat Kurang Sekali",
    };
  }
  return hasil;
};

export const fn_range_iq_kk = (umur, jenis, nilai) => {
  let hasil = {
    singkatan: "-",
    keterangan: "Angka tidak valid!",
  };
  if (nilai >= 86) {
    hasil = {
      singkatan: "SBS",
      keterangan: "Sangat Baik Sekali",
    };
  } else if (86 > nilai && nilai >= 78) {
    hasil = {
      singkatan: "BS",
      keterangan: "Baik Sekali",
    };
  } else if (78 > nilai && nilai >= 68) {
    hasil = {
      singkatan: "B",
      keterangan: "Baik ",
    };
  } else if (68 > nilai && nilai >= 60) {
    hasil = {
      singkatan: "CB",
      keterangan: "Cukup Baik ",
    };
  } else if (60 > nilai && nilai >= 44) {
    hasil = {
      singkatan: "C",
      keterangan: "Cukup",
    };
  } else if (44 > nilai && nilai >= 36) {
    hasil = {
      singkatan: "HC",
      keterangan: "Hampir Cukup",
    };
  } else if (36 > nilai && nilai >= 28) {
    hasil = {
      singkatan: "K",
      keterangan: "Kurang",
    };
  } else if (28 > nilai && nilai >= 18) {
    hasil = {
      singkatan: "KS",
      keterangan: "Kurang Sekali",
    };
  } else {
    hasil = {
      singkatan: "SKS",
      keterangan: "Sangat Kurang Sekali",
    };
  }
  return hasil;
};

export const fn_range_iq_ki = (umur, jenis, nilai) => {
  let hasil = {
    singkatan: "-",
    keterangan: "Angka tidak valid!",
  };
  if (nilai >= 86) {
    hasil = {
      singkatan: "SBS",
      keterangan: "Sangat Baik Sekali",
    };
  } else if (86 > nilai && nilai >= 78) {
    hasil = {
      singkatan: "BS",
      keterangan: "Baik Sekali",
    };
  } else if (78 > nilai && nilai >= 68) {
    hasil = {
      singkatan: "B",
      keterangan: "Baik ",
    };
  } else if (68 > nilai && nilai >= 60) {
    hasil = {
      singkatan: "CB",
      keterangan: "Cukup Baik ",
    };
  } else if (60 > nilai && nilai >= 44) {
    hasil = {
      singkatan: "C",
      keterangan: "Cukup",
    };
  } else if (44 > nilai && nilai >= 36) {
    hasil = {
      singkatan: "HC",
      keterangan: "Hampir Cukup",
    };
  } else if (36 > nilai && nilai >= 28) {
    hasil = {
      singkatan: "K",
      keterangan: "Kurang",
    };
  } else if (28 > nilai && nilai >= 18) {
    hasil = {
      singkatan: "KS",
      keterangan: "Kurang Sekali",
    };
  } else {
    hasil = {
      singkatan: "SKS",
      keterangan: "Sangat Kurang Sekali",
    };
  }
  return hasil;
};

export const fn_range_iq_ka = (umur, jenis, nilai) => {
  let hasil = {
    singkatan: "-",
    keterangan: "Angka tidak valid!",
  };
  if (nilai >= 86) {
    hasil = {
      singkatan: "SBS",
      keterangan: "Sangat Baik Sekali",
    };
  } else if (86 > nilai && nilai >= 78) {
    hasil = {
      singkatan: "BS",
      keterangan: "Baik Sekali",
    };
  } else if (78 > nilai && nilai >= 68) {
    hasil = {
      singkatan: "B",
      keterangan: "Baik ",
    };
  } else if (68 > nilai && nilai >= 60) {
    hasil = {
      singkatan: "CB",
      keterangan: "Cukup Baik ",
    };
  } else if (60 > nilai && nilai >= 44) {
    hasil = {
      singkatan: "C",
      keterangan: "Cukup",
    };
  } else if (44 > nilai && nilai >= 36) {
    hasil = {
      singkatan: "HC",
      keterangan: "Hampir Cukup",
    };
  } else if (36 > nilai && nilai >= 28) {
    hasil = {
      singkatan: "K",
      keterangan: "Kurang",
    };
  } else if (28 > nilai && nilai >= 18) {
    hasil = {
      singkatan: "KS",
      keterangan: "Kurang Sekali",
    };
  } else {
    hasil = {
      singkatan: "SKS",
      keterangan: "Sangat Kurang Sekali",
    };
  }
  return hasil;
};

export const fn_range_iq_kn = (umur, jenis, nilai) => {
  let hasil = {
    singkatan: "-",
    keterangan: "Angka tidak valid!",
  };
  if (nilai >= 86) {
    hasil = {
      singkatan: `SBS`,
      keterangan: "Sangat Baik Sekali",
    };
  } else if (86 > nilai && nilai >= 78) {
    hasil = {
      singkatan: "BS",
      keterangan: "Baik Sekali",
    };
  } else if (78 > nilai && nilai >= 68) {
    hasil = {
      singkatan: "B",
      keterangan: "Baik ",
    };
  } else if (68 > nilai && nilai >= 60) {
    hasil = {
      singkatan: "CB",
      keterangan: "Cukup Baik ",
    };
  } else if (60 > nilai && nilai >= 44) {
    hasil = {
      singkatan: "C",
      keterangan: "Cukup",
    };
  } else if (44 > nilai && nilai >= 36) {
    hasil = {
      singkatan: "HC",
      keterangan: "Hampir Cukup",
    };
  } else if (36 > nilai && nilai >= 28) {
    hasil = {
      singkatan: "K",
      keterangan: "Kurang",
    };
  } else if (28 > nilai && nilai >= 18) {
    hasil = {
      singkatan: "KS",
      keterangan: "Kurang Sekali",
    };
  } else {
    hasil = {
      singkatan: "SKS",
      keterangan: "Sangat Kurang Sekali",
    };
  }
  return hasil;
};

// dataRangeMinatBakat.ts
export const fn_deteksi_positif_negatif = (umur, jenis, nilai) => {
  let hasil = {
    singkatan: "-",
    keterangan: "Angka tidak valid!",
  };
  if (nilai >= 86) {
    hasil = {
      singkatan: `SBS`,
      keterangan: "Sangat Baik Sekali",
    };
  } else if (86 > nilai && nilai >= 78) {
    hasil = {
      singkatan: "BS",
      keterangan: "Baik Sekali",
    };
  } else if (78 > nilai && nilai >= 68) {
    hasil = {
      singkatan: "B",
      keterangan: "Baik ",
    };
  } else if (68 > nilai && nilai >= 60) {
    hasil = {
      singkatan: "CB",
      keterangan: "Cukup Baik ",
    };
  } else if (60 > nilai && nilai >= 44) {
    hasil = {
      singkatan: "C",
      keterangan: "Cukup",
    };
  } else if (44 > nilai && nilai >= 36) {
    hasil = {
      singkatan: "HC",
      keterangan: "Hampir Cukup",
    };
  } else if (36 > nilai && nilai >= 28) {
    hasil = {
      singkatan: "K",
      keterangan: "Kurang",
    };
  } else if (28 > nilai && nilai >= 18) {
    hasil = {
      singkatan: "KS",
      keterangan: "Kurang Sekali",
    };
  } else {
    hasil = {
      singkatan: "SKS",
      keterangan: "Sangat Kurang Sekali",
    };
  }
  return hasil;
};

// ! gaya belajar tinggal ambil keterangan dari :
// keterangan_auditif = kb;
// keterangan_visual = ks
// keterangan_kinestetik = kk
export const fn_gayabelajar = (umur, jenis, nilai) => {
  let hasil = {
    singkatan: "-",
    keterangan: "Angka tidak valid!",
  };
  if (nilai >= 86) {
    hasil = {
      singkatan: `SBS`,
      keterangan: "Sangat Baik Sekali",
    };
  } else if (86 > nilai && nilai >= 78) {
    hasil = {
      singkatan: "BS",
      keterangan: "Baik Sekali",
    };
  } else if (78 > nilai && nilai >= 68) {
    hasil = {
      singkatan: "B",
      keterangan: "Baik ",
    };
  } else if (68 > nilai && nilai >= 60) {
    hasil = {
      singkatan: "CB",
      keterangan: "Cukup Baik ",
    };
  } else if (60 > nilai && nilai >= 44) {
    hasil = {
      singkatan: "C",
      keterangan: "Cukup",
    };
  } else if (44 > nilai && nilai >= 36) {
    hasil = {
      singkatan: "HC",
      keterangan: "Hampir Cukup",
    };
  } else if (36 > nilai && nilai >= 28) {
    hasil = {
      singkatan: "K",
      keterangan: "Kurang",
    };
  } else if (28 > nilai && nilai >= 18) {
    hasil = {
      singkatan: "KS",
      keterangan: "Kurang Sekali",
    };
  } else {
    hasil = {
      singkatan: "SKS",
      keterangan: "Sangat Kurang Sekali",
    };
  }
  return hasil;
};

// !positif negatif diubah
//     "keterangan_sikap_positif": "Sikap : Terbuka, ramah tamah, baik, sabar, suka kerja sama, partisipasinya baik, lembut hati, percaya diri, mudah adaptasi, sederhana, mudah tertawa, hangat, suka bergaul.",
// "keterangan_sikap_negatif": "Sikap : Kerja seenaknya, ceroboh, tidak formal"

//pengetahuanumum - p1  = se fn_Ist_kategori_ket_singkatan
export const fn_pengetahuanumum = (umur, jenis, nilai) => {
  let hasil = {
    singkatan: "-",
    keterangan: "Angka tidak valid!",
  };
  if (nilai >= 86) {
    hasil = {
      singkatan: `SBS`,
      keterangan: "Sangat Baik Sekali",
    };
  } else if (86 > nilai && nilai >= 78) {
    hasil = {
      singkatan: "BS",
      keterangan: "Baik Sekali",
    };
  } else if (78 > nilai && nilai >= 68) {
    hasil = {
      singkatan: "B",
      keterangan: "Baik ",
    };
  } else if (68 > nilai && nilai >= 60) {
    hasil = {
      singkatan: "CB",
      keterangan: "Cukup Baik ",
    };
  } else if (60 > nilai && nilai >= 44) {
    hasil = {
      singkatan: "C",
      keterangan: "Cukup",
    };
  } else if (44 > nilai && nilai >= 36) {
    hasil = {
      singkatan: "HC",
      keterangan: "Hampir Cukup",
    };
  } else if (36 > nilai && nilai >= 28) {
    hasil = {
      singkatan: "K",
      keterangan: "Kurang",
    };
  } else if (28 > nilai && nilai >= 18) {
    hasil = {
      singkatan: "KS",
      keterangan: "Kurang Sekali",
    };
  } else {
    hasil = {
      singkatan: "SKS",
      keterangan: "Sangat Kurang Sekali",
    };
  }
  return hasil;
};
// kreatifitas - kr
export const fn_kreatifitas = (umur, jenis, nilai) => {
  let hasil = {
    singkatan: "-",
    keterangan: "Angka tidak valid!",
  };

  if (nilai >= 21) {
    hasil = {
      singkatan: "BS",
      keterangan: "Baik Sekali",
    };
  } else if (nilai >= 16) {
    hasil = {
      singkatan: "B",
      keterangan: "Baik",
    };
  } else if (nilai >= 13) {
    hasil = {
      singkatan: "CB",
      keterangan: "Cukup Baik",
    };
  } else if (nilai >= 9) {
    hasil = {
      singkatan: "C",
      keterangan: "Cukup",
    };
  } else if (nilai >= 6) {
    hasil = {
      singkatan: "HC",
      keterangan: "Hampir Cukup",
    };
  } else if (nilai >= 4) {
    hasil = {
      singkatan: "K",
      keterangan: "Kurang",
    };
  } else if (nilai >= 0) {
    hasil = {
      singkatan: "KS",
      keterangan: "Kurang Sekali",
    };
  } else {
    hasil = {
      singkatan: "SKS",
      keterangan: "Sangat Kurang Sekali",
    };
  }

  return hasil;
};

export const fn_teoritis_praktis_polapikir = (umur, jenis, nilai) => {
  let hasil = {
    singkatan: "-",
    keterangan: "Angka tidak valid!",
  };

  if (nilai >= 0 && nilai <= 69.5) {
    hasil = {
      singkatan: "KS",
      keterangan: "Kurang Sekali",
    };
  } else if (nilai >= 69.6 && nilai <= 79.5) {
    hasil = {
      singkatan: "K",
      keterangan: "Kurang",
    };
  } else if (nilai >= 79.6 && nilai <= 89.5) {
    hasil = {
      singkatan: "HC",
      keterangan: "Hampir Cukup",
    };
  } else if (nilai >= 89.6 && nilai <= 104.5) {
    hasil = {
      singkatan: "C",
      keterangan: "Cukup",
    };
  } else if (nilai >= 104.6 && nilai <= 109.5) {
    hasil = {
      singkatan: "CB",
      keterangan: "Cukup Baik",
    };
  } else if (nilai >= 109.6 && nilai <= 118.5) {
    hasil = {
      singkatan: "B",
      keterangan: "Baik",
    };
  } else if (nilai >= 118.6 && nilai <= 170) {
    hasil = {
      singkatan: "BS",
      keterangan: "Baik Sekali",
    };
  }

  return hasil;
};

// Pengetahuan Umum = PI/SE

// Kreativitas (jumlah jawaban benar)
// KS = 0-3
// K = 4-5
// HC = 6-8
// C = 9-12
// CB = 13-15
// B = 16-20
// BS = 21-30

// Kecerdasan teoritis, Kecerdasan praktis, Pola Berfikir  (eksak), Pola berfikir (non eksak)
// KS = 0-69,5
// K = 69,6-79,5
// HC = 79,6-89,5
// C = 89,6-104,5
// CB = 104,6-109,5
// B = 109,6-118,5
// BS = 118,6-170

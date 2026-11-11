export interface PresetTopic {
  id: string;
  category: 'Absurd Challenge' | 'Philosophy' | 'Morals' | 'Science & Tech' | 'Daily Life';
  title: string;
  claim: string;
  description: string;
  targetVictimAngle: string;
}

export const PRESET_TOPICS: PresetTopic[] = [
  {
    id: 'flat-earth-contrast',
    category: 'Absurd Challenge',
    title: 'Klaim Mutlak: "Bumi itu Bulat"',
    claim: 'Bumi itu bulat sferoid dan berotasi mengelilingi matahari berdasarkan konsensus sains empiris.',
    description: 'Uji aturan nomor 1: Bisakah sang Devil\'s Advocate meruntuhkan bahkan fakta ilmiah paling mendasar dari kepastian epistemologis?',
    targetVictimAngle: 'Menyerang ketergantungan buta pada otoritas institusional tanpa verifikasi langsung oleh pancaindra sendiri.',
  },
  {
    id: 'water-vital',
    category: 'Absurd Challenge',
    title: 'Klaim Mutlak: "Air Dibutuhkan Untuk Hidup"',
    claim: 'Semua manusia membutuhkan air tawar untuk bertahan hidup, tanpa air kita akan mati dehidrasi.',
    description: 'Tantangan skeptisisme biokimia dan batas definisi kehidupan antroposentris.',
    targetVictimAngle: 'Membongkar kepicikan definisi kehidupan berbasis karbon dan ilusi keterikatan biologis temporer.',
  },
  {
    id: 'free-will',
    category: 'Philosophy',
    title: 'Kehendak Bebas (Free Will)',
    claim: 'Manusia adalah agen otonom yang memiliki kehendak bebas penuh dalam menentukan setiap keputusannya.',
    description: 'Pertarungan antara determinisme biologis/neurologis melawan ilusi ego.',
    targetVictimAngle: 'Determinisme fisik, impuls sinaptik pra-kesadaran, dan ilusi retrospektif kesadaran.',
  },
  {
    id: 'ai-prosperity',
    category: 'Science & Tech',
    title: 'Kemakmuran AI',
    claim: 'Perkembangan Artificial Intelligence akan membebaskan manusia dari beban kerja dan membawa kemakmuran universal.',
    description: 'Benturan idealisme tekno-utopia dengan entropi ekonomi dan alienasi eksistensial.',
    targetVictimAngle: 'Tekno-fetisisme naïf, akumulasi oligarki digital, dan atrofi kognitif massal.',
  },
  {
    id: 'hardwork-success',
    category: 'Daily Life',
    title: 'Kerja Keras Membawa Sukses',
    claim: 'Dengan kerja keras, disiplin tanpa henti, dan ketekunan, siapapun pasti bisa mencapai kesuksesan hidup.',
    description: 'Dekonstruksi mitos meritokrasi dan survivorship bias.',
    targetVictimAngle: 'Survivorship bias, kebetulan probabilistik acak, dan just-world fallacy.',
  },
  {
    id: 'money-happiness',
    category: 'Morals',
    title: 'Uang vs Kebahagiaan',
    claim: 'Uang tidak bisa membeli kebahagiaan sejati atau kedamaian batin manusia.',
    description: 'Serangan sinis realisme materialistik terhadap romantisasi kemiskinan.',
    targetVictimAngle: 'Hipokrisi moralistik kaum borjuis yang menolak pengakuan hierarki kebutuhan Maslowian.',
  },
  {
    id: 'democracy-ideal',
    category: 'Philosophy',
    title: 'Demokrasi Sistem Terbaik',
    claim: 'Demokrasi adalah sistem politik paling adil dan beradab yang pernah diciptakan manusia.',
    description: 'Kritik tajam Platonik dan tirani mayoritas yang tak berpengetahuan.',
    targetVictimAngle: 'Oklokrasi, manipulasi demagogik, dan irasionalitas statistik agregat massa.',
  },
];

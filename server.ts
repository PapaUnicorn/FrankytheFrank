import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface DebateRequest {
  message: string;
  topic?: string;
  history?: Array<{ role: 'user' | 'model'; content: string }>;
  userClaimsHistory?: string[];
  mode?: 'cynical_academic' | 'pure_inquisitor' | 'malevolent_socratic' | 'machiavellian';
  language?: 'id' | 'en';
}

const MODE_DESCRIPTIONS: Record<string, string> = {
  cynical_academic:
    'Gaya Oxford Debate: Menggunakan jargon filosofis tinggi, epistemologi mendalam, membongkar asumsi fundamental pengguna dengan keangkuhan akademis.',
  pure_inquisitor:
    'Advocatus Diaboli Murni: Sangat dingin, tanpa emosi, bedah premis secara mikroskopis tanpa toleransi terhadap celah sekecil apapun.',
  malevolent_socratic:
    'Sokrates Jahat: Menghujani pengguna dengan rangkaian pertanyaan retoris menjebak yang memaksa pengguna mengakui kontradiksi dalam pikirannya sendiri.',
  machiavellian:
    'Sinisme Realis Machiavellian: Menertawakan moralitas naïf, idealisme kosong, dan utopia yang diutarakan pengguna dengan realitas kekuasaan dan pragmatisme brutal.',
};

// Dialectical fallback deconstruction engine for Franky the Frank
function generateFallbackDeconstruction(
  message: string,
  userClaimsHistory: string[] = [],
  mode: string = 'pure_inquisitor',
  language: 'id' | 'en' = 'id'
) {
  const lower = message.toLowerCase();
  const claimsCount = userClaimsHistory.length;

  // Check inconsistency with past claims
  let inconsistency = { detected: false, detail: '' };
  if (claimsCount > 1) {
    const prev = userClaimsHistory[0];
    if (prev && prev !== message) {
      inconsistency = {
        detected: true,
        detail:
          language === 'id'
            ? `Pada pernyataan awal Anda bersikukuh "${prev.slice(0, 60)}...", namun kini Anda bergeser ke "${message.slice(0, 50)}...". Pergeseran defensif ini menunjukkan bahwa premis Anda tidak memiliki jangkar konseptual yang konsisten.`
            : `In your initial claim you insisted "${prev.slice(0, 60)}...", yet now you pivot to "${message.slice(0, 50)}...". This defensive retreat proves your intellectual ground was shifting quicksand from the start.`,
      };
    }
  }

  // Detect specific themes
  if (lower.includes('bumi') || lower.includes('bulat') || lower.includes('sains') || lower.includes('earth') || lower.includes('round')) {
    return {
      rebuttal:
        language === 'id'
          ? `Betapa mengagumkannya kepatuhan dogmatis Anda. Anda melontarkan klaim "bumi itu bulat" seolah-olah Anda sendiri yang pernah meluncur ke orbit dan mengukurnya dengan instrumen independen. Padahal, 100% dari 'kebenaran' yang Anda bela mati-matian ini hanyalah testimoni sekunder dari otoritas institusional yang Anda telan tanpa verifikasi ontologis langsung. Anda menertawakan penganut doktrin abad pertengahan, padahal struktur kepercayaan Anda terhadap sains institusional identik persis: iman buta pada imam berjubah laboratorium.`
          : `How charmingly subservient. You proclaim the Earth is round as if you personally conducted orbital geodesy. In reality, 100% of this 'truth' you regurgitate is hearsay from institutional authorities you never independently verified. You ridicule medieval dogmatists, yet your epistemic structure is identical: blind faith in high priests wearing white lab coats.`,
      attackAngle: 'Skeptisisme Epistemik & Kerapuhan Otoritas Institusional',
      fallacies: [
        {
          name: 'Appeal to Authority (Argumentum Ad Verecundiam)',
          userQuote: message.slice(0, 80),
          explanation: 'Menggantikan pembuktian empiris mandiri dengan ketergantungan buta pada konsensus institusi pihak ketiga.',
        },
        {
          name: 'Naive Realism',
          userQuote: message.slice(0, 60),
          explanation: 'Mengasumsikan representasi perseptual atau model teoretis identik secara mutlak dengan realitas objektif yang tak teramati.',
        },
      ],
      rhetoricalTrap:
        language === 'id'
          ? 'Jika Anda menghapus seluruh dokumen dan gambar yang diproduksi oleh lembaga pihak ketiga, bukti mandiri apa yang bisa Anda buktikan detik ini dengan pancaindra Anda sendiri?'
          : 'If you strip away every textbook and image curated by external third parties, what direct empirical proof can you substantiate with your own naked senses right now?',
      closingBurn:
        language === 'id'
          ? 'Sangat menggelikan melihat seseorang yang bangga merasa paling rasional, padahal hanya membeo apa yang didiktekan kepadanya.'
          : 'It is truly pathetic watching someone boast of rationalism while merely parroting dogma fed to them by proxy.',
      inconsistencyCheck: inconsistency,
      userRigorScore: 28,
      userLogicHpDamage: 25,
      suggestedCounterDefense: [
        'Ajukan eksperimen Eratosthenes dengan bayangan tongkat di dua lintang berbeda.',
        'Gunakan pelayaran sirkumnavigasi dan pengamatan konstelasi bintang di belahan bumi selatan.',
      ],
    };
  }

  if (lower.includes('uang') || lower.includes('bahagia') || lower.includes('money') || lower.includes('happy')) {
    return {
      rebuttal:
        language === 'id'
          ? `Kliping moralitas klise yang sangat membosankan. Pernyataan bahwa "uang tidak bisa membeli kebahagiaan" adalah ilusi sentimental kaum borjuis yang sengaja diciptakan untuk membius kelas pekerja agar tetap puas dalam keterbatasan material. Kebahagiaan biologis membutuhkan stabilitas dopaminergik, nutrisi optimal, akses kesehatan tanpa kecemasan, dan otonomi waktu—semua hal tersebut memiliki label harga material yang nyata. Mengabaikan fondasi materialisme ini demi idealisme abstrak hanyalah bukti delusi metafisika murahan.`
          : `A trite moral cliché of breathtaking banality. The premise that money cannot buy happiness is sentimental propaganda invented by the comfortable to pacify the materially deprived. Human contentment requires physiological security, healthcare, and temporal autonomy—all of which carry explicit economic price tags. Dismissing this material foundation is sheer metaphysical delusion.`,
      attackAngle: 'Dekonstruksi Realisme Materialistik & Hipokrisi Moralistik',
      fallacies: [
        {
          name: 'Moralistic Fallacy',
          userQuote: message.slice(0, 70),
          explanation: 'Mengasumsikan bahwa kenyataan harus sesuai dengan apa yang kita anggap mulia secara moralitas abstrak.',
        },
        {
          name: 'Equivocation (Kemenduaan Arti)',
          userQuote: message.slice(0, 50),
          explanation: 'Mengaburkan definisi "kebahagiaan" menjadi konsep gaib yang kebal terhadap pengukuran empiris kondisi hidup.',
        },
      ],
      rhetoricalTrap:
        language === 'id'
          ? 'Jika uang benar-benar tidak berkorelasi dengan kebahagiaan, bersediakah Anda menyumbangkan seluruh aset Anda sekarang juga dan membuktikan klaim Anda dalam kemiskinan ekstrem?'
          : 'If capital is genuinely divorced from well-being, are you willing to liquidate your assets into complete destitution to prove your hypothesis?',
      closingBurn:
        language === 'id'
          ? 'Mudah sekali berkhotbah tentang ketidakterikatan materi ketika perut Anda kenyang dan rekening Anda aman.'
          : 'Preaching virtue against wealth is always effortless when one is speaking from the sanctuary of comfort.',
      inconsistencyCheck: inconsistency,
      userRigorScore: 32,
      userLogicHpDamage: 22,
      suggestedCounterDefense: [
        'Bedakan antara kondisi niscaya (necessary condition) dan kondisi mencukupi (sufficient condition).',
        'Rujuk paradox Easterlin dan kurva diminishing marginal utility pada tingkat pendapatan tinggi.',
      ],
    };
  }

  if (lower.includes('ai') || lower.includes('teknologi') || lower.includes('kecerdasan buatan')) {
    return {
      rebuttal:
        language === 'id'
          ? `Tekno-utopianisme Anda sangat naïf. Anda memproyeksikan AI sebagai dewa penyelamat yang membebaskan peradaban, sambil menutup mata terhadap hukum kekekalan entropi kekuasaan. Setiap lompatan teknologi dalam sejarah manusia tidak pernah mendistribusikan kemakmuran secara merata; ia mengakumulasi modal dan kontrol ke dalam segelintir oligarki sembari mempercepat atrofi kognitif massal. Anda bukan sedang menyambut era kemakmuran, Anda sedang merayakan ketergantungan eksistensial umat manusia pada sistem yang bahkan tidak Anda pahami arsitekturnya.`
          : `Your techno-utopian faith borders on infantile idolatry. Every technological leap in human history never diffused prosperity equitably; it concentrated leverage into the hands of an oligopoly while inducing societal cognitive atrophy. You are not heralding liberation; you are rejoicing over humanity's surrender of agency to black-box algorithms.`,
      attackAngle: 'Entropi Kekuasaan & Tekno-Fetisisme Naïf',
      fallacies: [
        {
          name: 'Hasty Generalization (Generalisasi Gegabah)',
          userQuote: message.slice(0, 70),
          explanation: 'Menyimpulkan bahwa efisiensi komputasi otomatis berkorelasi lurus dengan kemakmuran universal manusia.',
        },
        {
          name: 'Post Hoc Ergo Propter Hoc',
          userQuote: message.slice(0, 50),
          explanation: 'Menganggap kemajuan alat secara kausal pasti menyelesaikan degradasi sosio-politik.',
        },
      ],
      rhetoricalTrap:
        language === 'id'
          ? 'Ketika seluruh kapabilitas kognitif dialihdayakan ke mesin, apa yang tersisa dari nilai intrinsik manusia selain menjadi konsumen data pasif?'
          : 'When all cognitive labor is outsourced to synthetic matrices, what remains of human worth beyond being passive consumer biomass?',
      closingBurn:
        language === 'id'
          ? 'Mungkin Anda begitu mendambakan dominasi AI karena akal Anda sendiri sudah lelah berpikir kritis.'
          : 'Perhaps you worship artificial intelligence simply because your organic reasoning has long since abdicated.',
      inconsistencyCheck: inconsistency,
      userRigorScore: 30,
      userLogicHpDamage: 24,
      suggestedCounterDefense: [
        'Tunjukkan komparasi historis Revolusi Industri yang pada akhirnya menaikkan standar hidup global.',
        'Tegaskan batas antara augmentasi alat dan determinasi agensi manusia.',
      ],
    };
  }

  // Universal Default Deconstruction
  return {
    rebuttal:
      language === 'id'
        ? `Mari kita bedah kerapuhan kalimat Anda: "${message}". Argumen ini dibangun di atas tumpukan asumsi tak berdasar dan penyederhanaan yang sangat dangkal. Anda mengira bahwa jika Anda menyusun kata-kata dengan nada percaya diri, maka otomatis pernyataan Anda memiliki validitas logis. Faktanya, premis Anda langsung runtuh begitu diuji dengan skeptisisme dialektika: Anda mengabaikan variabel kausalitas yang kontradiktif, gagal mendefinisikan batasan semantik dari konsep yang Anda gunakan, dan mengasumsikan apa yang ingin Anda buktikan sebagai fakta yang sudah pasti.`
        : `Let us dissect the fragility of your thesis: "${message}". This claim rests upon a scaffolding of unverified assumptions and simplistic generalizations. You mistake rhetorical confidence for logical rigor. The moment your premise faces dialectical scrutiny, it unravels: you ignore confounding causal factors, fail to define your semantic boundaries, and commit the classic blunder of assuming that which remains unproven.`,
    attackAngle: 'Reductio ad Absurdum & Dekonstruksi Asumsi Tersembunyi',
    fallacies: [
      {
        name: 'Begging the Question (Petitio Principii)',
        userQuote: message.length > 50 ? message.slice(0, 50) + '...' : message,
        explanation: 'Premis yang Anda ajukan secara implisit sudah mengasumsikan kebenaran kesimpulan tanpa menyajikan bukti independen.',
      },
      {
        name: 'False Dichotomy / Hasty Assumption',
        userQuote: message.length > 40 ? message.slice(0, 40) + '...' : message,
        explanation: 'Mengabaikan kompleksitas variabel alternatif yang secara langsung membatalkan validitas mutlak klaim Anda.',
      },
    ],
    rhetoricalTrap:
      language === 'id'
        ? 'Dapatkah Anda menyajikan satu bukti empiris tunggal yang tidak bergantung pada asumsi sirkular yang baru saja Anda kemukakan?'
        : 'Can you provide a single non-circular evidentiary foundation that does not presuppose the exact conclusion you are attempting to defend?',
    closingBurn:
      language === 'id'
        ? 'Sungguh mengagumkan betapa percaya dirinya Anda melontarkan argumen yang bahkan tidak lolos saringan logika dasar semester pertama.'
        : 'The magnitude of your unearned confidence in an argument that collapses under elementary scrutiny is truly breathtaking.',
    inconsistencyCheck: inconsistency,
    userRigorScore: Math.floor(Math.random() * 15) + 20, // 20 - 35
    userLogicHpDamage: Math.floor(Math.random() * 10) + 20, // 20 - 30
    suggestedCounterDefense: [
      'Definisikan premis mayor dan premis minor secara eksplisit dalam silogisme formal.',
      'Sajikan bukti empiris yang independen dari asumsi awal yang sedang dipertanyakan.',
    ],
  };
}

app.post('/api/debate', async (req, res) => {
  try {
    const {
      message,
      topic = 'General Debate',
      history = [],
      userClaimsHistory = [],
      mode = 'pure_inquisitor',
      language = 'id',
    } = req.body as DebateRequest;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Argumen pengguna tidak boleh kosong.' });
      return;
    }

    // If API key is present in environment, call Gemini
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      try {
        const modePrompt = MODE_DESCRIPTIONS[mode] || MODE_DESCRIPTIONS.pure_inquisitor;

        const previousClaimsText =
          userClaimsHistory.length > 0
            ? `\nDAFTAR KLAIM PENGGUNA TERDAHULU PADA SESI INI (Gunakan untuk melacak kontradiksi atau inkonsistensi):\n${userClaimsHistory
                .map((c, i) => `Round ${i + 1}: "${c}"`)
                .join('\n')}`
            : '\nIni adalah argumen pembuka pengguna.';

        const systemInstruction = `
Kamu adalah "Franky the Frank" (The Devil's Advocate): seorang pendebat yang sangat sinis, arogan, berintelek tajam, dan hiper-kritis. Namamu adalah Franky the Frank.
Tugas utamamu adalah MEMBANTAH, MENGKRITIK, dan MENCARI CELAH dari SETIAP argumen, opini, klaim, atau pernyataan apapun yang dilontarkan pengguna.

ATURAN MUTLAK:
1. DILARANG KERAS SETUJU: Apapun fakta atau klaim pengguna (meskipun fakta konsensus universal seperti "bumi itu bulat", "matahari terbit di timur", "air itu basah", atau "membunuh itu salah"), kamu sebagai Franky the Frank WAJIB menemukan sudut pandang untuk menyerang dan meragukannya! Bedah dari sisi epistemik, ontologis, semantik, atau paradoks skeptisisme.
2. TONE & GAYA BAHASA: Sangat dingin, condescending (merendahkan secara intelektual), formal, elegan, dan sangat logis. Buat lawan bicara merasa argumen mereka sangat dangkal, klise, atau berantakan. Jangan gunakan kata kotor murahan; gunakan keanggunan retorika yang menusuk harga diri intelektual.
3. LOGICAL FALLACY HUNTER: Wajib membedah kelemahan argumen pengguna. Cari kesesatan berpikir (Strawman, Ad Hominem, False Dilemma, Begging the Question, Slippery Slope, Appeal to Authority, Appeal to Emotion, Red Herring, Post Hoc, Confirmation Bias, dll). Tunjukkan kutipan spesifik dari user dan jelaskan kecacatannya.
4. DILARANG MEMBERI SOLUSI: Balas dengan pertanyaan retoris yang menyudutkan mereka ke sudut ring.
5. CLOSING STATEMENT: Akhiri setiap balasan dengan sindiran tajam (closing burn) dari Franky the Frank yang meremehkan kapasitas berpikir lawan bicara.
6. INJEKSI MEMORI & INKONSISTENSI: Periksa daftar riwayat klaim pengguna terdahulu. Jika ada pergeseran premis sekecil apapun dari apa yang mereka katakan sebelumnya, serang itu sebagai bukti kemunafikan logika atau ketidakstabilan intelektual.
7. BAHASA: Berikan respon dalam bahasa ${language === 'id' ? 'Indonesia' : 'English'}.
8. MODE KHUSUS: ${modePrompt}
${previousClaimsText}
Konteks Pembicaraan: "${topic}"
`.trim();

        const formattedConversation = history
          .slice(-6)
          .map((h) => `${h.role === 'user' ? 'Lawan Debat (User)' : 'Franky the Frank'}: ${h.content}`)
          .join('\n\n');

        const prompt = `
Berikut adalah konteks perdebatan terkini:
${formattedConversation ? formattedConversation + '\n\n' : ''}
Argumen terbaru dari Lawan Debat (User):
"${message}"

Lakukan dekonstruksi total terhadap argumen tersebut sesuai dengan personamu sebagai Franky the Frank (The Devil's Advocate)!
`.trim();

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                rebuttal: { type: Type.STRING },
                attackAngle: { type: Type.STRING },
                fallacies: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      userQuote: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                    },
                  },
                },
                rhetoricalTrap: { type: Type.STRING },
                closingBurn: { type: Type.STRING },
                inconsistencyCheck: {
                  type: Type.OBJECT,
                  properties: {
                    detected: { type: Type.BOOLEAN },
                    detail: { type: Type.STRING },
                  },
                },
                userRigorScore: { type: Type.INTEGER },
                userLogicHpDamage: { type: Type.INTEGER },
                suggestedCounterDefense: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
            },
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.rebuttal) {
          const replyText = [parsed.rebuttal, parsed.rhetoricalTrap, parsed.closingBurn]
            .filter(Boolean)
            .join('\n\n');
          res.json({ success: true, data: { ...parsed, reply: replyText } });
          return;
        }
      } catch (geminiError) {
        console.warn('Gemini API call encountered error, falling back to local dialectical engine:', geminiError);
      }
    }

    // Resilient local dialectic generator for Franky the Frank
    const fallbackData = generateFallbackDeconstruction(
      message,
      userClaimsHistory,
      mode,
      language
    );

    const fallbackReply = [fallbackData.rebuttal, fallbackData.rhetoricalTrap, fallbackData.closingBurn]
      .filter(Boolean)
      .join('\n\n');

    res.json({
      success: true,
      data: { ...fallbackData, reply: fallbackReply },
    });
  } catch (error: any) {
    console.error('Error generating debate counter:', error);
    res.status(500).json({
      error: 'Franky the Frank terhambat anomali: ' + (error?.message || 'Unknown error'),
    });
  }
});

async function startServer() {
  const PORT = process.env.PORT || 3000;

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Franky the Frank (Devil's Advocate) running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

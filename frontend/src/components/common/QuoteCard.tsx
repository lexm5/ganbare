'use client';

import { useState, useEffect, useCallback } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Quote {
  text: string;
  author: string;
}

const BUILT_IN_QUOTES: Quote[] = [
  { text: '千里の道も一歩から。小さな一歩を積み重ねよう。', author: '老子' },
  { text: '為せば成る、為さねば成らぬ何事も。', author: '上杉鷹山' },
  { text: '継続は力なり。', author: 'ことわざ' },
  { text: '今日できることを明日に延ばすな。', author: 'ベンジャミン・フランクリン' },
  { text: '失敗は成功のもと。', author: 'ことわざ' },
  { text: '人生は近くで見ると悲劇だが、遠くから見れば喜劇である。', author: 'チャップリン' },
  { text: '行動は言葉より雄弁である。', author: 'エイブラハム・リンカーン' },
  { text: '夢なき者に理想なし、理想なき者に計画なし。', author: '吉田松陰' },
  { text: '努力は必ず報われる。もし報われない努力があるなら、それはまだ努力とは呼べない。', author: '王貞治' },
  { text: '人にできて、きみだけにできないなんてことあるもんか。', author: 'ドラえもん' },
  { text: '小さいことを重ねることが、とんでもないところに行くただ一つの道。', author: 'イチロー' },
  { text: '明日死ぬかのように生きよ。永遠に生きるかのように学べ。', author: 'マハトマ・ガンジー' },
  { text: '成功とは、失敗から失敗へと情熱を失わずに進むことである。', author: 'ウィンストン・チャーチル' },
  { text: '世界を変えたいなら、まず自分を変えよ。', author: 'マハトマ・ガンジー' },
  { text: 'やってみせ、言って聞かせて、させてみて、褒めてやらねば人は動かじ。', author: '山本五十六' },
  { text: '石の上にも三年。', author: 'ことわざ' },
  { text: '七転び八起き。', author: 'ことわざ' },
  { text: '天才とは1%のひらめきと99%の努力である。', author: 'トーマス・エジソン' },
  { text: '最も重要なことは、楽しんでいるかどうかだ。', author: 'スティーブ・ジョブズ' },
  { text: '困難の中にこそ、チャンスがある。', author: 'アルベルト・アインシュタイン' },
  { text: '一日一生。', author: '酒井雄哉' },
  { text: '壁というのは、できる人にしかやってこない。', author: 'イチロー' },
  { text: '挑戦した不成功者には再挑戦者としての新しい輝きが約束される。', author: '松下幸之助' },
  { text: '人生に失敗がないと、人生を失敗する。', author: '斎藤茂太' },
  { text: 'できると思えばできる。できないと思えばできない。これは揺るぎない絶対的な法則である。', author: 'パブロ・ピカソ' },
  { text: '今を大切に。あなたの今の生き方が、あなたの未来を作る。', author: '不明' },
  { text: '涙の数だけ強くなれるよ。', author: '岡本真夜' },
  { text: '始めることさえ忘れなければ、人はいつまでも若くある。', author: 'マルティン・ブーバー' },
  { text: '自分自身を信じてみるだけでいい。きっと、生きる道が見えてくる。', author: 'ゲーテ' },
  { text: '楽しまずして何の人生ぞや。', author: '吉川英治' },
];

function getRandomQuote(exclude?: Quote): Quote {
  const pool = exclude
    ? BUILT_IN_QUOTES.filter(q => q.text !== exclude.text)
    : BUILT_IN_QUOTES;
  return pool[Math.floor(Math.random() * pool.length)];
}

interface QuoteCardProps {
  quote?: string;
  author?: string;
}

export default function QuoteCard({ quote: propQuote, author: propAuthor }: QuoteCardProps) {
  const [currentQuote, setCurrentQuote] = useState<Quote>(() => {
    if (propQuote) return { text: propQuote, author: propAuthor || '' };
    return getRandomQuote();
  });
  const [apiQuote, setApiQuote] = useState<Quote | null>(null);
  const [showApi, setShowApi] = useState(false);

  // Fetch a quote from external API on mount
  useEffect(() => {
    const controller = new AbortController();
    fetch('https://zenquotes.io/api/random', { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data[0]) {
          setApiQuote({ text: data[0].q, author: data[0].a });
        }
      })
      .catch(() => { /* ignore - use built-in quotes */ });
    return () => controller.abort();
  }, []);

  const handleRefresh = useCallback(() => {
    // Alternate between API quote and built-in quotes
    if (apiQuote && !showApi) {
      setCurrentQuote(apiQuote);
      setShowApi(true);
    } else {
      setCurrentQuote(prev => getRandomQuote(prev));
      setShowApi(false);
    }
  }, [apiQuote, showApi]);

  return (
    <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <FormatQuoteIcon sx={{ color: 'primary.main', fontSize: 32, flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1 }}>
              {currentQuote.text}
            </Typography>
            {currentQuote.author && (
              <Typography variant="body2" color="text.secondary">
                — {currentQuote.author}
              </Typography>
            )}
          </Box>
          <Tooltip title="別の名言を表示">
            <IconButton onClick={handleRefresh} size="small" sx={{ flexShrink: 0 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}

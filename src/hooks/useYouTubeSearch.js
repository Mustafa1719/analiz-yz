import { useState, useEffect } from 'react';

const N8N_SEARCH_URL = 'https://mustafaaydinlabmind.app.n8n.cloud/webhook/youtube-read';


export function useYouTubeSearch(keyword, language = 'tr', maxResults = 6) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!keyword) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const body = {
      keyword,
      language,
      maxResults,
    };

    fetch(N8N_SEARCH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        if (!data.success) throw new Error('Video listesi alınamadı');
        setVideos(data.videos || []);
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [keyword, language, maxResults]);

  return { videos, loading, error };
}

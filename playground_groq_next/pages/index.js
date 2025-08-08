import React, {useState} from 'react';
import axios from 'axios';

export default function Home() {
  const [skill, setSkill] = useState('conversation');
  const [fileData, setFileData] = useState(null);
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const b64 = await toBase64(f);
    setFileData({ name: f.name, b64 });
  };

  const submit = async () => {
    setLoading(true);
    setResult(null);
    try {
      if (skill === 'conversation') {
        const res = await axios.post('/api/conversation', { filename: fileData?.name, audio_b64: fileData?.b64 });
        setResult(res.data);
      } else if (skill === 'image') {
        const res = await axios.post('/api/image', { filename: fileData?.name, image_b64: fileData?.b64 });
        setResult(res.data);
      } else if (skill === 'summarize') {
        const res = await axios.post('/api/summarize', { url, filename: fileData?.name, doc_b64: fileData?.b64 });
        setResult(res.data);
      }
    } catch (err) {
      setResult({ error: err.response?.data || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{padding:24,fontFamily:'Arial'}}>
      <h1>Playground Groq (Next.js)</h1>
      <div style={{marginBottom:12}}>
        <label style={{marginRight:8}}><input type="radio" name="s" checked={skill==='conversation'} onChange={()=>setSkill('conversation')} /> Conversation (audio)</label>
        <label style={{marginRight:8}}><input type="radio" name="s" checked={skill==='image'} onChange={()=>setSkill('image')} /> Image</label>
        <label><input type="radio" name="s" checked={skill==='summarize'} onChange={()=>setSkill('summarize')} /> Document/URL</label>
      </div>

      {skill !== 'summarize' ? (
        <div style={{marginBottom:12}}>
          <input type="file" onChange={handleFile} />
          {fileData && <div style={{marginTop:8}}>Selected: {fileData.name}</div>}
        </div>
      ) : (
        <div style={{marginBottom:12}}>
          <input placeholder='Or enter a URL to summarize' value={url} onChange={e=>setUrl(e.target.value)} style={{width:'60%'}} />
          <div style={{marginTop:8}}>Or upload a doc file</div>
          <input type="file" onChange={handleFile} />
        </div>
      )}

      <div>
        <button onClick={submit} disabled={loading || (skill!=='summarize' && !fileData && !url)}> {loading? 'Processing...':'Submit'} </button>
      </div>

      <div style={{marginTop:20}}>
        <h3>Result</h3>
        <pre style={{whiteSpace:'pre-wrap',background:'#f6f6f6',padding:12}}>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </div>
  );
}

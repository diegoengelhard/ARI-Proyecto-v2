import { useState } from 'react';
import { convert }   from '../api';

const defaultTxt =
  '03110567-7;Jaime Roberto;Climaco Navarrete;2346570012456;GOLD;22779898;POLYGON ((-90.7695 17.8177, -90.7439 17.8178))';

const endpointMap = {
  'txt-xml' : 'txt-to-xml',
  'txt-json': 'txt-to-json',
  'xml-txt' : 'xml-to-txt',
  'json-txt': 'json-to-txt'
};

export default function ConverterForm({ setResult }) {
  const [mode,       setMode]   = useState('txt-xml');
  const [content,    setContent]= useState(defaultTxt);
  const [delimiter,  setDelim]  = useState(';');
  const [key,        setKey]    = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!key) { alert('Debes ingresar la clave AES-256 (64 hex).'); return; }

    const payload = { delimiter, key };

    switch (mode) {
      case 'txt-xml':
      case 'txt-json':
        payload.content = content;
        break;
      case 'xml-txt':
        payload.xml = content;
        break;
      case 'json-txt':
        try { payload.json = JSON.parse(content); }
        catch { return alert('JSON inválido en área de texto'); }
        break;
      default: return;
    }

    try {
      const endpoint = endpointMap[mode];        // ✅ usa el nombre correcto
      const data     = await convert(endpoint, payload);
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(err.response?.data?.error || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
      <label>
        Conversión:&nbsp;
        <select value={mode} onChange={e=>setMode(e.target.value)}>
          <option value="txt-xml">TXT → XML</option>
          <option value="txt-json">TXT → JSON</option>
          <option value="xml-txt">XML → TXT</option>
          <option value="json-txt">JSON → TXT</option>
        </select>
      </label>

      <textarea
        rows={8}
        value={content}
        onChange={e=>setContent(e.target.value)}
        style={{fontFamily:'monospace'}}
      />

      <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
        <label>
          Delimitador&nbsp;
          <input
            value={delimiter}
            onChange={e=>setDelim(e.target.value)}
            size={2}
          />
        </label>
        <label style={{flex:1}}>
          Clave Hex&nbsp;
          <input
            value={key}
            onChange={e=>setKey(e.target.value)}
            style={{width:'100%'}}
          />
        </label>
      </div>

      <button type="submit">Convertir</button>
    </form>
  );
}

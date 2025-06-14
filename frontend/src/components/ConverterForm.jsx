// src/components/ConverterForm.jsx
import { useState }   from 'react';
import { convert }    from '../api';
import { toast }      from 'react-toastify';

const defaultTxt =
  '03110567-7;Jaime Roberto;Climaco Navarrete;2346570012456;GOLD;22779898;POLYGON ((-90.7695 17.8177, -90.7439 17.8178))';

const endpointMap = {
  'txt-xml' : 'txt-to-xml',
  'txt-json': 'txt-to-json',
  'xml-txt' : 'xml-to-txt',
  'json-txt': 'json-to-txt'
};

export default function ConverterForm({ setResult }) {
  const [mode,      setMode]    = useState('txt-xml');
  const [content,   setContent] = useState(defaultTxt);   // entrada
  const [resultRaw, setRaw]     = useState('');           // salida “real”
  const [delimiter, setDelim]   = useState(';');
  const [key,       setKey]     = useState('');
  const [noErrors,       setNoErrors]     = useState(false);

  /* cargar archivo */
  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setContent(ev.target.result);
    reader.readAsText(file);

    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'txt')  setMode('txt-xml');
    if (ext === 'xml')  setMode('xml-txt');
    if (ext === 'json') setMode('json-txt');
  };

  /* submit */
  const handleSubmit = async e => {
    e.preventDefault();
    if (!key) { toast.warn('Ingrese la clave AES-256 (64 hex).'); return; }

    const payload = { delimiter, key };
    try {
      switch (mode) {
        case 'txt-xml':
        case 'txt-json':
          payload.content = content; break;
        case 'xml-txt':
          payload.xml = content; break;
        case 'json-txt':
          try { payload.json = JSON.parse(content); }
          catch { toast.error('JSON inválido'); return; }
          break;
        default: return;
      }

      const data = await convert(endpointMap[mode], payload);

      /* determinar valor real para preview & descarga */
      const raw =
        data.xml  ??                       // preferir xml
        (data.json ? JSON.stringify(data.json, null, 2) : null) ??
        data.txt  ??
        '';

      setRaw(raw);
      setResult(JSON.stringify(data, null, 2));
      setNoErrors(true);
      toast.success('Conversión exitosa');

    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setRaw('');
      setResult(msg);
      toast.error(`Error: ${msg}`);
    }
  };

  /* descarga */
  const handleDownload = () => {
    if (!resultRaw) { toast.info('Nada que descargar'); return; }

    /* elegir extensión según modo o contenido */
    const ext = mode.endsWith('xml')
                ? 'xml'
                : mode.endsWith('json')
                  ? 'json'
                  : 'txt';

    const blob = new Blob([resultRaw], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `resultado.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    resetValues();
  };

  function resetValues() {
    setMode('txt-xml');
    setContent(defaultTxt);
    setRaw('');
    setDelim(';');
    setKey('');
    setNoErrors(false);
    setResult('');
  }

  /* UI */
  return (
    <form onSubmit={handleSubmit}
          style={{display:'flex',flexDirection:'column',gap:'1rem'}}>

      <label>
        Conversión:&nbsp;
        <select value={mode} onChange={e=>setMode(e.target.value)}>
          <option value="txt-xml">TXT → XML</option>
          <option value="txt-json">TXT → JSON</option>
          <option value="xml-txt">XML → TXT</option>
          <option value="json-txt">JSON → TXT</option>
        </select>
      </label>

      <input type="file" accept=".txt,.xml,.json" onChange={handleFile} />

      <textarea
        rows={8}
        value={content}
        onChange={e=>setContent(e.target.value)}
        style={{fontFamily:'monospace'}}
      />

      <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
        <label>
          Delimitador&nbsp;
          <input value={delimiter} onChange={e=>setDelim(e.target.value)} size={2}/>
        </label>
        <label style={{flex:1}}>
          Clave Hex&nbsp;
          <input value={key} onChange={e=>setKey(e.target.value)} style={{width:'100%'}}/>
        </label>
      </div>

      <div style={{display:'flex',gap:'1rem'}}>
        <button type="submit">Convertir</button>
        <button 
          type="button" 
          onClick={handleDownload}
          disabled={!noErrors}
        >
          Descargar
        </button>
      </div>
    </form>
  );
}

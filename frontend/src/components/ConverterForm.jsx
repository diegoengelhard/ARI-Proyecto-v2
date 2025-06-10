import { useState } from 'react';
import { convert }   from '../api';
import { toast } from 'react-toastify';

const defaultTxt =
  '03110567-7;Jaime Roberto;Climaco Navarrete;2346570012456;GOLD;22779898;POLYGON ((-90.7695 17.8177, -90.7439 17.8178))';

// relación modo ↔ endpoint real
const endpointMap = {
  'txt-xml' : 'txt-to-xml',
  'txt-json': 'txt-to-json',
  'xml-txt' : 'xml-to-txt',
  'json-txt': 'json-to-txt'
};

export default function ConverterForm({ setResult }) {
  const [mode,       setMode]    = useState('txt-xml');
  const [content,    setContent] = useState(defaultTxt);
  const [delimiter,  setDelim]   = useState(';');
  const [key,        setKey]     = useState('');

  if (!key) {
    toast.warn('Ingrese la clave AES-256 (64 hex).');
    return;
  }

  /* --- carga de archivo --- */
  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setContent(ev.target.result);
    reader.readAsText(file);

    // auto-selecciona modo según extensión
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'txt') setMode('txt-xml');
    if (ext === 'xml') setMode('xml-txt');
    if (ext === 'json') setMode('json-txt');
  };

  /* --- submit --- */
  const handleSubmit = async e => {
    e.preventDefault();
    if (!key) return alert('Ingrese la clave AES-256 (64 hex).');

    const payload = { delimiter, key };

    try {
      switch (mode) {
        case 'txt-xml':
        case 'txt-json':
          payload.content = content; break;
        case 'xml-txt':
          payload.xml = content; break;
        case 'json-txt':
          payload.json = JSON.parse(content); break;
        default: return;
      }

      const data = await convert(endpointMap[mode], payload);
      setResult(JSON.stringify(data, null, 2));
      toast.success('Conversión exitosa');
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      toast.error(`Error: ${msg}`);
      setResult(msg);
    }
  };

  /* --- descarga del resultado --- */
  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download =
      mode.endsWith('xml')  ? 'resultado.xml'  :
      mode.endsWith('json') ? 'resultado.json' : 'resultado.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
      {/* ------- selector de modo ------- */}
      <label>
        Conversión:&nbsp;
        <select value={mode} onChange={e=>setMode(e.target.value)}>
          <option value="txt-xml">TXT → XML</option>
          <option value="txt-json">TXT → JSON</option>
          <option value="xml-txt">XML → TXT</option>
          <option value="json-txt">JSON → TXT</option>
        </select>
      </label>

      {/* ------- file chooser ------- */}
      <input type="file" accept=".txt,.xml,.json"
             onChange={handleFile} />

      {/* ------- área editable / preview ------- */}
      <textarea
        rows={8}
        value={content}
        onChange={e=>setContent(e.target.value)}
        style={{fontFamily:'monospace'}}
      />

      {/* ------- delimitador y clave ------- */}
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

      {/* ------- acciones ------- */}
      <div style={{display:'flex',gap:'1rem'}}>
        <button type="submit">Convertir</button>
        <button type="button" onClick={handleDownload}>Descargar</button>
      </div>
    </form>
  );
}

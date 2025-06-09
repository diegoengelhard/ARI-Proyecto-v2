export default function ResultBox({ result }) {
  return (
    <pre style={{
      background:'#f4f4f4',
      padding:'1rem',
      overflowX:'auto',
      minHeight:'160px',
      border:'1px solid #ccc'
    }}>
      {result || '⇠ El resultado aparecerá aquí'}
    </pre>
  );
}

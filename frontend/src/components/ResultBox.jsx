export default function ResultBox({ result }) {
  return (
    <pre style={{
      background:'#f4f4f4',
      padding:'1rem',
      overflowX:'auto',
      minHeight:'150px'
    }}>
      {result || '⇠ Resultado aparecerá aquí'}
    </pre>
  );
}

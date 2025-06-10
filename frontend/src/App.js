import { useState }    from 'react';
import ConverterForm   from './components/ConverterForm';
import ResultBox       from './components/ResultBox';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [result,setResult] = useState('');

  return (
    <div style={{maxWidth:1000,margin:'0 auto',padding:'2rem',fontFamily:'sans-serif'}}>
      <h2>Conversor XML / JSON / TXT</h2>
      <ConverterForm setResult={setResult}/>
      <ResultBox result={result}/>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

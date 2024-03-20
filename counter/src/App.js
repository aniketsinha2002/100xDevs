import Counter from './Counter.js';
import './App.css';
import { RecoilRoot } from 'recoil';
import Button from './Button.js';
import Even from './Even.js';

function App() {
  return (
  <div className="App">
    <div className="container">
      <RecoilRoot>
        <Counter />
        <Button />
        <Even/>
      </RecoilRoot>
    </div>
  </div>
);
}

export default App;

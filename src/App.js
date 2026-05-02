import { useState } from 'react';
function App() {
  const [criteres] = useState(['Prix', 'Qualité', 'Design']);

  const [matrice, setMatrice] = useState([[1,3,5],[0.333,1,2],[0.2,0.5,1]]);
  const [res, setRes] = useState(null);
  const calc = () => {
    const n = criteres.length;
    const colSum = matrice[0].map((_,j) => matrice.reduce((s,r) => s + r[j], 0));
    const poids = matrice.map(r => r.map((v,j) => v / colSum[j]))
                        .map(r => r.reduce((s,v) => s + v, 0) / n);
    const lambda = matrice.map((r,i) =>
      r.reduce((s,v,j) => s + v * poids[j], 0) / poids[i]
    ).reduce((s,v) => s + v, 0) / n;
    const CI = (lambda - n) / (n - 1);
    const RI = [0,0,0.58,0.9,1.12,1.24,1.32,1.41,1.45][n];
    const CR = CI / RI;
    setRes({ poids, CR: CR.toFixed(3), ok: CR < 0.1 });
  };
  return (
    <div style={{padding:20, fontFamily:'Arial', maxWidth:800, margin:'auto'}}>
      <h1>AHP Decision Tool - Project_0</h1>
      <h3>1. Matrice de comparaison des critères</h3>
      <p>1=égal, 3=modéré, 5=fort, 7=très fort, 9=extrême</p>
      <table border="1" cellPadding="5">
        <tbody>
          <tr><td></td>{criteres.map(c => <td key={c}><b>{c}</b></td>)}</tr>
          {matrice.map((r,i) => <tr key={i}>
            <td><b>{criteres[i]}</b></td>
            {r.map((v,j) => <td key={j}>
              <input type="number" step="0.1" value={v} style={{width:60}}
                onChange={e => {
                  const nm = [...matrice];
                  nm[i][j] = parseFloat(e.target.value);
                  nm[j][i] = 1/parseFloat(e.target.value);
                  setMatrice(nm);
                }}/>
            </td>)}
          </tr>)}
        </tbody>
      </table>
      <br/><button onClick={calc} style={{padding:10, fontSize:16}}>Calculer AHP</button>
      {res && <div style={{marginTop:20, padding:15, background:'#f0f0f0'}}>
        <h3>Résultat</h3>
        <p><b>Poids des critères:</b> {criteres.map((c,i) => `${c}: ${(res.poids[i]*100).toFixed(1)}% `)}</p>
        <p><b>Ratio de cohérence CR = {res.CR}</b></p>
        {res.ok?
          <p style={{color:'green'}}><b>✅ Matrice COHÉRENTE.</b> Vous pouvez utiliser ces poids pour choisir la meilleure alternative.</p> :
          <p style={{color:'red'}}><b>❌ Matrice INCOHÉRENTE car CR {'>'} 0.1</b><br/>
          Raison: Vos jugements se contredisent. Exemple: si A > B et B > C, alors on doit avoir A > C. Revoyez la matrice.</p>
        }
      </div>}
    </div>
  );
}
export default App;
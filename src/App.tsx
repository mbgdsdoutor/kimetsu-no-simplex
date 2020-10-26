/* eslint-disable */

import React, { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import bg from "./bg.jpg";
import {
  findColunaPivo,
  temElementoNegativoLinhaZ,
  findMaiorElementoNegativoLinhaZ,
  getPivoAndLinhaPivo,
  gauss,
  PivoObject,
} from "./utils";

export interface Linha {
  valueX: number;
  valueY: number;
  valueRs: number;
}

export enum LinhaOptions {
  ValueX = "valueX",
  ValueY = "valueY",
  ValueRs = "valueRs",
}

function App() {
  const alfabeto = ["A", "B", "C", "D", "E", "F", "G"];
  const [maxX, setMaxX] = useState<number>(0);
  const [maxY, setMaxY] = useState<number>(0);
  const [linhas, setLinhas] = useState<Linha[]>([
    { valueX: 0, valueY: 0, valueRs: 0 },
  ]);
  const [tables, setTables] = useState<number[][][]>([]);
  const [pivos, setPivos] = useState<PivoObject[]>([]);

  const input1: number[][] = [
    [2, 1, 1, 0, 0, 16],
    [1, 2, 0, 1, 0, 11],
    [1, 3, 0, 0, 1, 15],
    [-30, -50, 0, 0, 0, 0],
  ];

  const input2: number[][] = [
    [8, 2, 1, 0, 0, 16],
    [1, 1, 0, 1, 0, 6],
    [2, 7, 0, 0, 1, 28],
    [-1, -2, 0, 0, 0, 0],
  ];

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number,
    type: LinhaOptions
  ) => {
    let newLinhas = linhas;
    let linha = newLinhas[index];
    linha[type] = parseInt(event.target.value, 10);
    newLinhas[index] = linha;
    setLinhas([...newLinhas]);
  };

  const handleAddNewLinha = () => {
    setLinhas([...linhas, { valueX: 0, valueY: 0, valueRs: 0 }]);
  };

  const getInput = () => {
    const grid: number[][] = [];
    const gridRowZ: number[] = [];
    gridRowZ.push(maxX * -1);
    gridRowZ.push(maxY * -1);
    for (let i = -1; i < linhas.length; i++) {
      gridRowZ.push(0);
    }

    linhas.forEach((linha, index) => {
      const gridRow = [];
      gridRow.push(linha.valueX);
      gridRow.push(linha.valueY);
      for (let i = 0; i < linhas.length; i++) {
        if (index === i) {
          gridRow.push(1);
        } else {
          gridRow.push(0);
        }
      }
      gridRow.push(linha.valueRs);
      grid.push(gridRow);
    });
    grid.push(gridRowZ);

    play(grid);
    // play(input1);
  };

  useEffect(() => {}, []);

  const play = (input: number[][]) => {
    setTables([]);
    setPivos([]);
    let newTables: number[][][] = [input];
    let newPivos: PivoObject[] = [];
    let grid = input;
    let linhaZ = grid[grid.length - 1];
    let maximoExecucoes = 50;
    while (temElementoNegativoLinhaZ(linhaZ)) {
      const pivo = getPivoAndLinhaPivo(
        grid,
        findColunaPivo(grid, findMaiorElementoNegativoLinhaZ(grid))
      );
      const gaussBoladao = gauss(grid, pivo);
      grid = gaussBoladao.grid;
      linhaZ = gaussBoladao.linhaZ;
      newTables.push(grid);
      newPivos.push(pivo);
      maximoExecucoes--;
      if (maximoExecucoes <= 0) break;
    }
    setTables([...newTables]);
    setPivos(newPivos);
  };

  return (
    <div>
      <img className="bg" src={bg} />
      <h2><span>Kimetsu no Simplex</span></h2>
      <div className="container">
        <h1>
          <b>Max Z =</b>
          <input
            type="number"
            value={maxX}
            onChange={(event) => setMaxX(parseInt(event.target.value, 10))}
          />
          x<span>+</span>
          <input
            type="number"
            value={maxY}
            onChange={(event) => setMaxY(parseInt(event.target.value, 10))}
          />
          y
        </h1>
        {linhas.map((el, index) => (
          <div className="row" key={`row-${index}`}>
            
            <input
              type="number"
              value={el.valueX}
              onChange={(event) =>
                handleInputChange(event, index, LinhaOptions.ValueX)
              }
            />
            x<span>+</span>
            <input
              type="number"
              value={el.valueY}
              onChange={(event) =>
                handleInputChange(event, index, LinhaOptions.ValueY)
              }
            />
            y<span>{"<="}</span>
            <input
              style={{marginRight: '16px'}}
              type="number"
              value={el.valueRs}
              onChange={(event) =>
                handleInputChange(event, index, LinhaOptions.ValueRs)
              }
            />
            {index === linhas.length - 1 && (
              <button onClick={handleAddNewLinha}>Adicionar Linha</button>
            )}
          </div>
        ))}
        <button onClick={getInput} style={{position: 'relative', left: 'calc(50% - 60px)'}}>Maximização!</button>

        <div className="tables">
          {tables.map((table, i) => (
            <table key={`table-${i}`}>
              <thead>
                <tr>
                  <th>Base</th>
                  <th>x</th>
                  <th>y</th>
                  {linhas.map((el, index) => (
                    <th key={`table-header-cell-${index}`}>
                      {alfabeto[index]}
                    </th>
                  ))}
                  <th>Rs</th>
                </tr>
              </thead>
              <tbody>
                {table.map((t, tindex) => (
                  <tr key={`table-row-${tindex}`}>
                    <td>{table.length - 1 === tindex ? 'Z' : alfabeto[tindex]}</td>
                    {t.map((el, elindex) => (
                      <td
                        key={`table-cell-${elindex}`}
                        style={{
                          color:
                            pivos[i]?.indexColunaPivo === elindex &&
                            pivos[i]?.indexLinhaPivo === tindex &&
                            pivos[i]?.pivo === el
                              ? "red"
                              : "black",
                          fontWeight:
                          pivos[i]?.pivo === el
                            ? "bold"
                            : "normal",
                          backgroundColor:
                            pivos[i]?.indexColunaPivo === elindex ||
                            pivos[i]?.indexLinhaPivo === tindex
                              ? "#69d2ff"
                              : "white",
                        }}
                      >
                        {Number.isInteger(el) ? el : el.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

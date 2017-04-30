import React, { Component } from 'react'
import VirtualList from './VirtualList'
import VirtualTable from './VirtualTable'

export default class App extends Component {
  constructor(){
    super()
    this.state = { itens: this.getItens(200000) }
  }

  getItens(qtd){
    const itens = []
    for (let i = 0; i < qtd; i++){
      itens.push({key: i, id: i, text: `Item n. ${i}`, actions: 'salvar'})
    }
    return itens
  }

  render(){
    const { itens } = this.state
    return <div>
      <h1>Virtual List!</h1>
      <VirtualList
        itens={this.state.itens}
        component={Item}
        itemHeight={36}
        blockSize={50}
      />
      <h1>Table</h1>
        <VirtualTable
          header={Header}
          itens={this.state.itens}
          component={Row}
          itemHeight={36}
          blockSize={50}
          type="table"
        />
{/*      <button onClick={e => {
        this.setState({itens: [...this.state.itens, ...this.getItens(100)]})
      }}>Add itens</button>*/}
    </div>
  }
}

const Header = () => (
  <tr>
    <th>id</th>
    <th>nome</th>
    <th>lorem</th>
    <th>actions</th>
    <th></th>
  </tr>
)

const Item = ({imageId, text}) => (
  <li><i className="fa fa-check"/> <span>{text}</span></li>
)

const Row = ({id, text}) => (
  <tr><td>{id}</td><td>{text}</td><td>Lorem ipsum dolor sit amet.</td><td>Salvar</td></tr>
)

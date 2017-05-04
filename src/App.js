import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class App extends Component {
  constructor(){
    super()
    //this.state = {uri:'http://s2.glbimg.com/pyAuw_gLffUSHIn3A3j9Lau0wKQ=/s.glbimg.com/jo/g1/f/original/2010/09/05/corcovado_seop_300x225.jpg'}
     this.state = {uri: null}

  }
  componentDidMount(){
/*    this.setState({
      uri: 'http://s2.glbimg.com/pyAuw_gLffUSHIn3A3j9Lau0wKQ=/s.glbimg.com/jo/g1/f/original/2010/09/05/corcovado_seop_300x225.jpg'
    })*/
  }
  render(){
    return <ImageUploader
            value={this.state.uri}
            onChange={ e => {
              const uri = 'http://imgsapp2.correiobraziliense.com.br/portlet/74/75/20170503151535784480e.jpg'
              this.setState({uri})
            }}
          />
  }
}

class ImageUploader extends Component {
  static get defaultProps(){
    return {
      file: null
    }
  }

  constructor(){
    super()
    this.state = { file: null, value: null, isNew: false}
  }

  componentDidMount(){
    const { value } = this.props
    this.setState({value})
  }

  getDraggableParent(target){
    return target && target.classList.contains('dropzone') ?
      target :
      target && this.getDraggableParent(target.parentElement)
  }

  addDraggableClass(target){
    const draggable = this.getDraggableParent(target)
    draggable && !draggable.classList.contains('active') && draggable.classList.add('active')
  }

  removeDraggableClass(target){
    const draggable = this.getDraggableParent(target)
    draggable && draggable.classList.remove('active')
  }

  dragOver(e){
    e.preventDefault()
    e.stopPropagation()

    this.addDraggableClass(e.target)
  }

  dragEnter(e){
    e.preventDefault()
    e.stopPropagation()
    this.addDraggableClass(e.target)
  }

  dragLeave(e){
    e.preventDefault()
    e.stopPropagation()
    this.removeDraggableClass(e.target)
  }

  drop(e){
    e.preventDefault()
    e.stopPropagation()

    const { onChange } = this.props
    const file = e.dataTransfer.files[0]
    console.log(file.type)

    if (!(file.type == 'image/jpeg')) return false;

    onChange && onChange(file)
    this.removeDraggableClass(e.target)
  }

  render(){
    const {onChange, value, draggable} = this.props
    const { file } = this.state

    return <div className="image-uploader dropzone"
                onDragOver={ e => this.dragOver(e) }
                onDragEnter={ e => this.dragEnter(e) }
                onDragLeave={ e => this.dragLeave(e) }
                onDrop={ e => this.drop(e) }>
      {
        value ? <div className="image-container" style={{backgroundImage: `url(${value})`}}>
          <div>{file && file.name}</div>
          {/*<img src={value}/>*/}
          <button onClick={ e => this.refs.inputFile.click() }>
            <i className="fa fa-cloud-upload"/><span>Selecionar Nova Imagem</span>
          </button>
          </div>
          :
          <div className="info">
            <i className="fa fa-image"/>
            <div>
              <p>Selecione uma imagem clicando no botão abaixo ou arrastando uma imagem para este espaço</p>
              <button onClick={ e => this.refs.inputFile.click() }>
                <i className="fa fa-cloud-upload"/><span>Adicionar Imagem</span>
              </button>
            </div>
          </div>
      }

      <input ref="inputFile" type="file" id="image-uploader" onChange={e => {
        this.setState({file: e.target.files[0], isNew: true, value: null})
        onChange && onChange(file)
      }}/>
    </div>
  }
}

class DnD extends Component {
  constructor(){
    super()

    const data = [
      {id: 1, order: 1, text: 'test1'},
      {id: 2, order: 2, text: 'test2'},
      {id: 3, order: 3, text: 'test3'},
      {id: 4, order: 4, text: 'test4'},
      {id: 5, order: 5, text: 'test5'},
    ]
    this.state = { data }
  }

  dragStart(e, value){
    e.stopPropagation()
    e.dataTransfer.setData('Text', JSON.stringify(value))
  }

  dragOver(e){
    e.preventDefault()
    e.stopPropagation()
  }

  dragLeave(e){
    console.log('leave')
    e.preventDefault()
    e.stopPropagation()
    e.target.classList.remove('over')
  }

  dragEnter(e){
    e.stopPropagation()
    e.preventDefault()
    e.target.classList.add('over')
  }

  drop(e,value){
    const dropped = JSON.parse(e.dataTransfer.getData('Text'))

    e.stopPropagation()
    e.preventDefault()
    e.target.classList.remove('over')
    this.reorder(this.state.data, dropped, value.order)
  }

  reorder(data, item, newOrder, orderField='order'){
    const itemIndex = data.findIndex(d => d.order === newOrder)

    if (newOrder < item.order){
      const firstPart = data.slice(0, itemIndex)
      const lastPart = data.slice(itemIndex)
        .filter(d => d.id !== item.id)
        .map((d) => {
          return { ...d, order: d[orderField] + 1}
        })
      const dragged = {...item, order: newOrder}
      this.setState({ data: [...firstPart, dragged, ...lastPart]})
    } else {
      const firstPart = data.slice(0, itemIndex + 1)
        .filter(d => d.id !== item.id)
        .map((d) => {
          return { ...d, order: d[orderField] - 1}
        })
      const lastPart = data.slice(itemIndex+1)
      const dragged = {...item, order: newOrder}
      this.setState({ data: [...firstPart, dragged, ...lastPart]})
      //console.log([...firstPart, dragged, ...lastPart].map(d => (JSON.stringify({[d.id]:d.order}))))
    }
  }

  sort(data){
    return data.sort((l, r) => {
      return l.order > r.order ? 1 : l.order < r.order ? -1 : 0
    })
  }

  render(){
    return <div className="drop-over"
                onDragOver={ e => this.dragOver(e)}>
      {
        this.sort(this.state.data).map((d, i ) => {
          {/*return SortableItem(<Item key={i} text={d.text}/>)*/}
          return SortableComponent(<Item text={d.text} key={i}/>)
          {/*return <div key={d.id}
                      draggable
                      onDragStart={ e => this.dragStart(e, d)}
                      onDragEnter={ e => this.dragEnter(e)}
                      onDragLeave={ e => this.dragLeave(e)}
                      onDrop={e => this.drop(e, d)}
          >
            { d.text }
          </div>*/}
        })
      }
    </div>
  }
}

const Item = ({key, text}) => (
  <div key={key}>{text}</div>
)

const SortableComponent = (component) => {
  return React.Children.map(component.props.children, child => {
    return React.cloneElement(child, {
      key: component.key,
      draggable: true
    })
  })
  /*const el = React.cloneElement( , {
    ...props,
    key: component.key,
    draggable: true,

  })
  return el*/
}

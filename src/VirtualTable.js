import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class VirtualList extends Component {
  static get defaultProps(){
    return {
      blockSize: 10,
      itemHeight: 36,
      itens: [],
      type: 'list'
    }
  }
  constructor(props){
    super(props)
    this.state = {
      itens: [],
      startHeight: 0,
      endHeight: 0,
      totalHeight: 0,
      currentPos: 0
    }

    this.bufferFactor = .5
    this.handleScroll = this.handleScroll.bind(this)
  }

  handleScroll(e){
    const {
      currentPos,
      blockHeight,
      visibleItensHeight,
      totalHeight
    } = this.state

    const pos = e.target.scrollTop

    if (pos > (blockHeight + currentPos - visibleItensHeight)){
      const newEnd = totalHeight - (blockHeight + pos)
      this.setState({
        currentPos: pos,
        startHeight: pos,
        endHeight: newEnd > 0 ? newEnd : 0
      })
    } else if (pos < currentPos){
      this.setState({
        currentPos: pos,
        startHeight: pos,
        endHeight: totalHeight - (blockHeight + pos)
      })
    }
  }

  componentDidMount(){
    this.virtualList = ReactDOM.findDOMNode(this.refs.virtualList)
    this.virtualList.addEventListener('scroll', this.handleScroll)
    this.updateHeadersWidth()
    this.calculateAllHeights(this.props)
  }

  componentDidUpdate(){
    this.updateHeadersWidth()
  }

  updateHeadersWidth(){
    window.requestAnimationFrame(() => {
      const thead = ReactDOM.findDOMNode(this.refs.thead)
      const ths = Array.from(thead.querySelectorAll('tr th'))
      Array.from(this.virtualList.querySelectorAll ('tr:nth-child(2) td')).forEach((el, i) => {
        ths[i].style.width = this.getStyle(el, 'width')
      })
    })
  }

  componentWillReceiveProps(newProps){
    this.calculateAllHeights(newProps)
  }

  calculateAllHeights(props){
    const { itemHeight, blockSize } = props
    const qtd = props.itens.length
    const height = parseFloat(this.getStyle(this.virtualList, 'height'))
    const totalHeight = qtd * itemHeight
    const startHeight = 0
    const endHeight = totalHeight - (blockSize * itemHeight)
    const visibleItensHeight = Math.floor(height / itemHeight)
    const blockHeight = blockSize * itemHeight;

    this.setState({
      itens: props.itens,
      currentPos: this.state.currentPos || 0,
      startHeight,
      endHeight,
      totalHeight,
      blockHeight,
      height,
      visibleItensHeight
    })
  }

  getStyle(el, prop){
    return window.getComputedStyle(el, null).getPropertyValue(prop)
  }

  componentWillUnmount(){
    this.virtualList.removeEventListener('scroll', this.handleScroll)
  }

  getItensFromCurrentPosition(itens){
    const { currentPos } = this.state
    const start = Math.floor(currentPos / this.props.itemHeight)
    return itens.slice(start, start + (this.props.blockSize * (1 + this.bufferFactor)))
  }

  render(){
    const {
      itens,
      startHeight,
      endHeight,
    } = this.state

    return <div className="virtual-table">
      <table>
        <thead ref="thead">
        { React.createElement(this.props.header, {}) }
        </thead>
      </table>
      <div className="virtual-list"  ref="virtualList">
        <table className="virtual-table">
          <tbody>
        <tr className="start" style={{height: Math.floor(startHeight) || 0}}></tr>
        {
          this.getItensFromCurrentPosition(itens).map((it, k) => (
            React.createElement(this.props.component, {...it, key: k})
          ))
        }
        <tr className="end" style={{ height: Math.floor(endHeight) || 0}}></tr>
        </tbody>
        </table>
    </div>
    </div>
  }
}

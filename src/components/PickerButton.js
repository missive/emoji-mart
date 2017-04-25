import React from 'react'
import PropTypes from 'prop-types'
import { Picker } from '.'
import onClickOutside from 'react-onclickoutside'


class PickerButton extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      visible : false,
      iconNo : 0
    };
  }
  handleClickOutside(e){
    this.setState({ visible : false });
  }
  render(){
    return (

      <div className="">
        <div className="">
            <div className={`emoji-picker-icon icon-index-${this.state.iconNo} ${(this.state.visible) ? 'selected' : ''}`} onMouseEnter={this.handleMouseOver.bind(this)} onClick={this.handleMouseClick.bind(this)}></div>
        </div>
        <div className="">
          {this.renderPicker()}
        </div>
      </div>
    );
  }
  renderPicker(){
    if(this.state.visible){
      let {pickerProps} = this.props;
      return(
        <Picker {...pickerProps}/>
      );
    }else{
      return null;
    }
  }
  handleMouseOver(){
    if(!this.state.visible){
      let iconTotal = 49;
      this.setState({iconNo : Math.floor(Math.random() * iconTotal) + 1 });
    }
  }
  handleMouseClick(){
    let visible = !this.state.visible;
    this.setState({visible : visible});
  }
}
PickerButton.propTypes = {
  pickerProps: PropTypes.object
}
export default onClickOutside(PickerButton)

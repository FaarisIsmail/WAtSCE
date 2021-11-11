import React from 'react';

export default class ImageWrapper extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <div>
          <svg id={"svg-chart"} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="100%" height="100%"/>
            <circle cx="50%" cy="50%" r="2" fill="white"/>
          </svg>
      </div>      
    )
  }
}
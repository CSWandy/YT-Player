import React from 'react'

const Switch = ({switchKey, children}) => {

  return children.filter(child => child.props.case === switchKey)  
};

export default Switch
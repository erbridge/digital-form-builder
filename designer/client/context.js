import React from 'react'

export const FlyoutContext = React.createContext(
  {
    count: 0,
    increment: () => {},
    decrement: () => {}
  }
)

export const DataContext = React.createContext({
  data: {},
  save: async () => {}
})

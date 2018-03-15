var data = {"type":"story","index":1,"htmlFileName":"story-1.html","code":"import { story } from '../client';\nimport * as React from 'react';\nimport { Anchor } from '../app/components/anchor';\nimport { Button } from '../app/components/buttons';\n\nstory()\n  .demo(<Anchor href=\"https://twitter.com/basarat\" target=\"_blank\">\n    As an example click here to open twitter\n  </Anchor>)\n  .demo(<Anchor href=\"https://github.com/basarat/eze\" target=\"_blank\">\n    Or click here to open github\n  </Anchor>)\n  .demo(class App extends React.Component {\n    state = {\n      count: 0\n    }\n    increment = () => {\n      this.setState({ count: this.state.count + 1 });\n    }\n    render() {\n      return <Button text={'Click count: ' + this.state.count} onClick={this.increment}/>\n    }\n  })\n  .render();\n","demoCodes":["<Anchor href=\"https://twitter.com/basarat\" target=\"_blank\">\n  As an example click here to open twitter\n</Anchor>","<Anchor href=\"https://github.com/basarat/eze\" target=\"_blank\">\n  Or click here to open github\n</Anchor>","class App extends React.Component {\n  state = {\n    count: 0\n  }\n  increment = () => {\n    this.setState({ count: this.state.count + 1 });\n  }\n  render() {\n    return <Button text={'Click count: ' + this.state.count} onClick={this.increment}/>\n  }\n}"],"pageSubDirName":"stories","entryPointPath":"/home/travis/build/basarat/eze/src/docs/story-1.tsx"}
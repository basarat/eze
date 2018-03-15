import { story } from '../client';
import * as React from 'react';
import { Anchor } from '../app/components/anchor';
import { Button } from '../app/components/buttons';

story()
  .demo(<Anchor href="https://twitter.com/basarat" target="_blank">
    As an example click here to open twitter
  </Anchor>)
  .demo(<Anchor href="https://github.com/basarat/eze" target="_blank">
    Or click here to open github
  </Anchor>)
  .demo(class App extends React.Component {
    state = {
      count: 0
    }
    increment = () => {
      this.setState({ count: this.state.count + 1 });
    }
    render() {
      return <Button text={'Click count: ' + this.state.count} onClick={this.increment}/>
    }
  })
  .render();

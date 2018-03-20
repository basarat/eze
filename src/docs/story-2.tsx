import { story } from '../client';
import * as React from 'react';
import { Button } from '../app/components/buttons';

story()
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

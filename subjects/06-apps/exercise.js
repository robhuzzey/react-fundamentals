////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// - Create a chat application using the utility methods we give you.
//
// Already done?
//
// - Create a filter that lets you filter messages in the chat by
//   sender and/or content
//
////////////////////////////////////////////////////////////////////////////////
var React = require('react');
var { login, sendMessage, subscribeToMessages } = require('./utils/ChatUtils');


var Message = React.createClass({
  render() {
    return (
      <li>
        <p><img src={this.props.data.avatar} width="40" /></p>
        <p>Message: {this.props.data.text}</p>
        <p>Name: {this.props.data.username}</p>
      </li>
    )
  }
});

var TextBox = React.createClass({
  sendMessage() {
    sendMessage(
      'general', // the channel to post a message to, please post to "general" at first
      this.props.auth.github.displayName, // the github user name
      this.props.auth.github.profileImageURL, // the github avatar
      this.refs.input.value // the actual message
    );
  },
  render() {
    return <div><input ref="input" type="text" /><button onClick={this.sendMessage}>Send</button></div>
  }
});


var Giphy = function(message) {
  var search = message.text.match(/\/giphy\s[\w]+/);
  if(search) {
    var q = search[0].replace('/giphy ', '');

    fetch(new Request('http://api.giphy.com/v1/gifs/search?q=' + q + '&api_key=dc6zaTOxFJmzC')).then(function(response) { 
      response.json().then(
        function(json) {
          console.log(json.data[0].images.fixed_height_small.url);
          sendMessage(
            'general', // the channel to post a message to, please post to "general" at first
            'Giphy Bot: ' + q, // the github user name
            json.data[0].images.fixed_height_small.url, // the github avatar
            '^^^^ @' + message.username +  ' See the avatar ^^^^' // the actual message
          );
        }
      );
    });
  }
};

var App = React.createClass({

  getInitialState() {
    return {
      messages: [],
      unsubscribe: null
    }
  },

  componentDidMount() {
    login((error, auth) => {
      this.setState({
        auth
      });
      this.unsubscribe = subscribeToMessages('general', (messages) => {
        Giphy(messages.pop());
        this.setState({
          messages
        })
      });
    })
  },

  render() {
    return (
      <div>
        <h1>Hello</h1>
        <TextBox auth={this.state.auth} />
        <ul>
          {this.state.messages.reverse().map(function(message) {
            return <Message data={message} />
          })}
        </ul>
      </div>
    )
  }
});

React.render(<App />, document.getElementById('app'));

/*

Here's how to use the ChatUtils:

login((error, auth) => {
  // hopefully the error is `null` and you have a github
  // `auth` object
});

sendMessage(
  'general', // the channel to post a message to, please post to "general" at first
  'ryanflorence', // the github user name
  'https://avatars.githubusercontent.com/u/100200?v=3', // the github avatar
  'hello, this is a message' // the actual message
);

var unsubscribe = subscribeToMessages('general', (messages) => {
  // here are your messages as an array, it will be called
  // every time the messages change
});
unsubscribe(); // stop listening for changes

The world is your oyster!

*/


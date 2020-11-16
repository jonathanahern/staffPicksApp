import React, { Component } from "react";
import {
  AppProvider,
  Banner,
  Page,
  Stack,
  RadioButton,
  Button,
  Card,
  TextField,
  TextStyle,
  List
} from "@shopify/polaris";

class Help extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      message: "",
      email: "",
      name_error: "",
      email_error: "",
      message_error: "",
      message_sent: false,
      message_loading: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(name, value) {
    this.checkForErrors(name);
    let state = this.state;
    state[name] = value;
    this.setState({ state });
  }

  handleSubmit() {
    let data = {name: this.state.name, email: this.state.email, message: this.state.message};
    this.setState({ message_loading: true });
    this.props.sendEmail(data).then((resp) => this.submitResponse(resp));
  }

  submitResponse(resp){
    this.setState({ message_loading: false });
    if('message' in resp){
      this.setState({ name: "", message: "", email: "", message_sent: true});
    } else if (resp[0].includes("Name")){
      this.setState({name_error:"A name is required"})
    } else if (resp[0].includes("Email")){
      this.setState({email_error:"Invalid email"})
    } else if (resp[0].includes("Message")){
      this.setState({message_error:"A message is required"})
    } else {
      this.setState({message_error:"An error occurred. Please try again."})
    }
  }

  checkForErrors(name){
    if (name === "name" && this.state.name_error.length > 0){
      this.setState({ name_error: "" });
    } else if (name === "message" && this.state.message_error.length > 0){
      this.setState({ message_error: "" });
    } else if (name === "email" && this.state.email_error.length > 0){
      this.setState({ email_error: "" });
    }
  }

  messageSent(){
    if (this.state.message_sent){
      return <>
        <br />
        <br />
        <Banner title="Message Sent. A response will arrive shortly." status="success" onDismiss={() => { this.setState({ message_sent: false }) }}>
        </Banner>
        <br />
      </>;
    } else {
      return <></>;
    }  
  }

  render() {
    const {message_loading} = this.state;
    return (
      <AppProvider>
        <br />
        <br />
        <Page title="Help">
          <Card sectioned title="FAQs">
            <TextStyle>How can I format how the picks appear in my store?</TextStyle>
          </Card>
          <Card sectioned title="Contact">
            <TextStyle variation="subdued">If you have any trouble whatsoever, send me a message. I'd be happy to help.</TextStyle>
            <br />
            <br />
            <TextField
              value={this.state.name}
              onChange={this.handleChange.bind(this, "name")}
              label="Name"
              type="text"
              maxLength={24}
              fullWidth
              error={this.state.name_error}
            />
            <br />
            <TextField
              value={this.state.email}
              onChange={this.handleChange.bind(this, "email")}
              label="Email"
              type="text"
              maxLength={80}
              fullWidth
              error={this.state.email_error}
            />
            <br />
            <TextField
              value={this.state.message}
              onChange={this.handleChange.bind(this, "message")}
              label="Message"
              type="text"
              multiline={true}
              maxLength={600}
              showCharacterCount={true}
              fullWidth
              error={this.state.message_error}
            />
            <br />
            <Button
              primary={true}
              loading={message_loading}
              onClick={this.handleSubmit}
            >Send Message
          </Button>
          {this.messageSent()}
          </Card>
        </Page>
      </AppProvider>
    );
  }
}

export default Help;

import React, { Component } from "react";
import {
  AppProvider,
  Banner,
  Page,
  Button,
  Card,
  TextField,
  TextStyle,
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
            <TextStyle variation="strong">The picks don't look right on my page. How can I fix it?</TextStyle>
            <div className="tabbed"><TextStyle>You can change the position of the pick in the Settings tab. However since not all themes are formatted the same, you may need to edit the SCSS code to your liking. If you need any help, contact me and I'd love to help.</TextStyle></div>
            <TextStyle variation="strong">Why is there a new Staff Picks collection?</TextStyle>
            <div className="tabbed"><TextStyle>When the app is downloaded, it should automatically create a new collection for your staff picks. This helps create recommendations on product pages for your staff picks. When new picks are created, they are automatically tagged to be placed in this collection.</TextStyle></div>
            <TextStyle variation="strong">How can I reset a staff member's individual page?</TextStyle>
            <div className="tabbed"><TextStyle>Pages are created when a staff member is added. The only way to reset the page to default is to recreate the staff member from scratch.</TextStyle></div>
            <TextStyle variation="strong">My new picks and staff aren't showing up. Where are they?</TextStyle>
            <div className="tabbed"><TextStyle>Shops only check for new picks every 5 minutes. If it still doesn't show after 5 minutes, please contact me!</TextStyle></div>
            <TextStyle variation="strong">How many picks and staff can I add?</TextStyle>
            <div className="tabbed"><TextStyle>There is a current limit of 100 picks and 24 staff.</TextStyle></div>         
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

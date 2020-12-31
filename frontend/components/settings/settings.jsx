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
  List,
  Modal
} from "@shopify/polaris";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page_title: "",
      subtitle: "",
      sticker: this.props.settings.sticker,
      layout: this.props.settings.layout,
      sticker_theme: true,
      layout_theme: this.props.settings.layout_theme,
      save_loading_sticker: false,
      save_disabled_sticker: true,
      button_loading: false,
      save_loading: false,
      save_disabled: true,
      title_loading: false,
      title_disabled: true,
      page_created: false,
      sticker_theme_added: false,
      sticker_theme_cleared: false,
      sticker_modal_open: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.saveSticker = this.saveSticker.bind(this);
    this.handleStickerChange = this.handleStickerChange.bind(this);
    this.handleLayoutChange = this.handleLayoutChange.bind(this);
    this.handleCreatePage = this.handleCreatePage.bind(this);
    this.layoutText = this.layoutText.bind(this);
    this.layoutInstructions = this.layoutInstructions.bind(this);
    this.resetPageCreation = this.resetPageCreation.bind(this);

  }

  componentDidMount() {
    this.props.fetchSetting(1).then((data) => this.setupSettings());
  }

  setupSettings(){
    this.setState({ sticker: this.props.settings["sticker"] });
    this.setState({ layout: this.props.settings["layout"] });
    this.setState({ sticker_theme: this.props.settings["sticker_theme"] });
  }

  handleCreatePage(){
    this.setState({ title_loading: true });
    const pageData = {page_title: this.state.page_title, subtitle: this.state.subtitle};
    this.props.createStaffPage(pageData).then(data =>
      this.resetPageCreation()
    );
  }

  resetPageCreation(){
    this.setState({ page_title: "" });
    this.setState({ subtitle: "" });
    this.setState({ title_loading: false });
    this.setState({ page_created: true });
  }

  handleStickerChange(checked, newVal) {
    this.setState({ sticker: newVal });
    if (newVal !== this.props.settings.sticker){
      this.setState({ save_disabled_sticker: false });
    } else {
      this.setState({ save_disabled_sticker: true });
    }
  }

  handleLayoutChange(checked, newVal) {
    if (this.state.save_disabled) {
      this.setState({ save_disabled: false });
    }
    this.setState({ layout: newVal });
  }

  handleChange(name, value) {
    if (name === "page_title" && value.length > 0){
      this.setState({ title_disabled: false });
    } else if (name === "page_title" && value.length < 1) {
      this.setState({ title_disabled: true });
    }
    let state = this.state;
    state[name] = value;
    this.setState({ state });
  }

  handleSubmit() {
    const settings = Object.assign({}, this.state);
    this.setState({ save_loading: true });
    this.props.updateSetting(settings).then((data) => this.returnToDisabled());
  }

  saveSticker(){
    const stickerSettings = { sticker: this.state.sticker, layout: null }
    this.setState({ save_loading_sticker: true });
    this.props.updateSetting(stickerSettings).then((data) => this.returnToStickerDisabledSticker());
  }

  layoutInstructions(){
    const insideCol = <List type="number">
      <List.Item>Navigate to Online Store/Themes and in the Actions dropdown click Edit code. It is also recommended to "Download theme file" for a backup.</List.Item>
      <List.Item>Open the product-template liquid file, or the file that displays the product page.</List.Item>
      <List.Item>Locate the div or other element that contains the column.</List.Item>
      <List.Item>Copy and paste the staff-pick-ele div into the bottom of the container element.</List.Item>
    </List>;

    const sideCol = <List type="number">
      <List.Item>Navigate to Online Store/Themes and in the Actions dropdown click Edit code. It is also recommended to "Download theme file" for a backup.</List.Item>
      <List.Item>Open the product-template liquid file, or the file that displays the product page.</List.Item>
      <List.Item>Locate the div or other element that contains the product information.</List.Item>
      <List.Item>Wrap a main-content-sp div element around the large container element.</List.Item>
      <List.Item>Wrap a full-container-sp div element around the main content div.</List.Item>
      <List.Item>Between the closing div tags of the main content and full container, paste the staff-pick-ele div.</List.Item>
    </List>;

    const bottomPage = <List type="number">
      <List.Item>Navigate to Online Store/Themes and in the Actions dropdown click Edit code. It is also recommended to "Download theme file" for a backup.</List.Item>
      <List.Item>Open the product-template liquid file, or the file that displays the product page.</List.Item>
      <List.Item>Locate the div or other element that contains the product information.</List.Item>
      <List.Item>Copy and paste the staff-pick-ele div directly beneath the container element.</List.Item>
    </List>;

    switch (this.state.layout) {
      case "inside-col":
        return insideCol;
      case "side-col":
        return sideCol;
      case "bottom-page":
        return bottomPage;
      default:
        return "";
    }

  }

  layoutText(){
    const insideCol = `<!-- <div> The column container element -->
    <!-- Column's content -->
    <div id="staff-pick-ele"></div>
<!-- </div>  -->`;

    const bottomPage = `<!-- <div>  The product container element -->
    <!-- The product data -->
<!-- </div>  -->
<div id="staff-pick-ele"></div>`;

    const sideCol = `<div id="full-container-sp">
    <div id="main-content-sp">
        <!-- <div>  The product container element -->
          <!-- The product data -->
        <!-- </div> -->
    </div>
    <div id="staff-pick-ele"></div>
</div>`;

    switch (this.state.layout) {
      case "inside-col":
        return insideCol;
      case "side-col":
        return sideCol;
      case "bottom-page":
        return bottomPage;
      default:
        return "";
    }

  }

  returnToStickerDisabledSticker(){
    this.setState({ save_loading_sticker: false });
    this.setState({ save_disabled_sticker: true });   
  }

  returnToDisabled(){
    this.setState({ save_loading: false });
    this.setState({ save_disabled: true });
  }

  createStickerDiv(){
    this.setState({ button_loading: true });
    this.props.insertStickers({auto: "auto"}).then(data =>
      this.createStickerResp(data)
    );
  }

  createStickerResp(data){
    this.closeStickerModal();
    this.setState({ sticker_theme: this.props.settings["sticker_theme"] });
    this.setState({ button_loading: false });
    this.setState({ sticker_theme_added: true, sticker_theme_cleared: false });
  }

  clearStickerDiv(){
    this.setState({ button_loading: true });
    this.props.clearStickers().then(data =>
      this.clearStickerResp(data)
    );
  }

  clearStickerResp(data){
    this.setState({ sticker_theme: this.props.settings["sticker_theme"] });
    this.setState({ button_loading: false });
    this.setState({ sticker_theme_cleared: true, sticker_theme_added: false });
  }

  pageCreatedAlert(){
    if (this.state.page_created){
      return <>
        <br />
        <Banner title="Page Created" status="success" onDismiss={() => { this.setState({ page_created: false }) }}>
          <p>A staff page has been created. Link to it for customers to meet your staff!</p>
        </Banner>
        <br />
      </>;
    } else {
      return <></>;
    }  
  }

  stickerThemeAdded(){
    let response = "Sticker code successfully added to theme";
    let title = "Success";
    let status = "success";
    if (!this.props.settings.sticker_theme){
      response = "Your theme was not compatible with the installation process. Either contact us for assistance or use the detailed manual installation."
      title = "Error";
      status = "critical";
    }
    if (this.state.sticker_theme_added){
      return <>
        <Banner title={title} status={status} onDismiss={() => { this.setState({ sticker_theme_added: false }) }}>
          <p>{response}</p>
        </Banner>
      </>;
    } else {
      return <></>;
    }  
  }

    stickerThemeCleared(){
    let response = "Sticker code successfully cleared from theme";
    let title = "Success";
    let status = "success";
    if (this.props.settings.sticker_theme){
      response = "Your theme was not compatible with clearing the sticker code. Contact us for assistance."
      title = "Error";
      status = "critical";
    }
    if (this.state.sticker_theme_cleared){
      return <>
        <Banner title={title} status={status} onDismiss={() => { this.setState({ sticker_theme_cleared: false }) }}>
          <p>{response}</p>
        </Banner>
      </>;
    } else {
      return <></>;
    }  
  }

  closeStickerModal(){
    this.setState({ sticker_modal_open: false });
  }

  openStickerModal(){
    this.setState({ sticker_modal_open: true });
  }

  addStickerManually(){
    this.setState({ button_loading: true });
    this.props.insertStickers({auto: "manual"}).then(data =>
      this.createStickerResp()
    );
  }

  addLayoutTheme(){
    this.setState({ button_loading: true });
    const layout_data = { layout: this.state.layout };
    this.props.insertLayout(layout_data).then(data =>
      this.insertLayoutResp(data)
    );
  }

  insertLayoutResp(data){
    this.setState({ button_loading: false });
    console.log("Back");
  }

  render() {
    let selected = this.state.sticker;
    let selectedLayout = this.state.layout;

    const {save_disabled, save_loading, title_disabled, title_loading, save_disabled_sticker, save_loading_sticker, button_loading, sticker_theme, layout_theme, sticker_modal_open} = this.state;
    const red = (
      <img
        src="https://i.ibb.co/3kW5XsV/red-burst.png"
        alt="Price Vectors by Vecteezy"
        width="50px"
      />
    );
    const purple = (
      <img
        src="https://i.ibb.co/cC3Ry3v/purple-burst.png"
        alt="Price Vectors by Vecteezy"
        width="50px"
      />
    );
    const green = (
      <img
        src="https://i.ibb.co/cxqQbg9/green-burst.png"
        alt="Price Vectors by Vecteezy"
        width="50px"
      />
    );
    const blue = (
      <img
        src="https://i.ibb.co/JRgFHfL/blue-burst.png"
        alt="Price Vectors by Vecteezy"
        width="50px"
      />
    );
    const yellow = (
      <img
        src="https://i.ibb.co/HXqddbd/yellow-burst.png"
        alt="Price Vectors by Vecteezy"
        width="50px"
      />
    );

    const none = (
      <h4>None</h4>
    );

    const stickerInsertion = `<!-- <img>  The product image -->
<div class="staff-pick-alert" data-prodID="{{ product.id }}"></div>`;

    const sideCol = (
      <Stack vertical={true} spacing="tight">
        <TextStyle variation="strong">Side Column Pick</TextStyle>
        <img
          src="https://i.ibb.co/r7YgtdY/sideCol.png"
          width="120px"
        />
      </Stack>
    );
    const bottomPage = (
      <Stack vertical={true} spacing="tight">
        <TextStyle variation="strong">Bottom Page Pick</TextStyle>
      <img
        src="https://i.ibb.co/9yfGdFT/bottom-Page.png"
        width="120px"
      />
      </Stack>

    );
    const insideCol = (
      <Stack vertical={true} spacing="tight">
        <TextStyle variation="strong">Inside Column Pick</TextStyle>
      <img
        src="https://i.ibb.co/k9WMmsP/inside-Col.png"
        width="120px"
      />
      </Stack >

    );
    return (
      <>
      <AppProvider>
        <Page title="Settings/Setup">
          <Card sectioned title="Select a staff picks sticker for collection pages">
            <Stack>
              <RadioButton
                label={red}
                id="red"
                checked={selected === "red"}
                onChange={this.handleStickerChange}
              />
              <RadioButton
                label={purple}
                id="purple"
                checked={selected === "purple"}
                onChange={this.handleStickerChange}
              />
              <RadioButton
                label={green}
                id="green"
                checked={selected === "green"}
                onChange={this.handleStickerChange}
              />
              <RadioButton
                label={blue}
                id="blue"
                checked={selected === "blue"}
                onChange={this.handleStickerChange}
              />
              <RadioButton
                label={yellow}
                id="yellow"
                checked={selected === "yellow"}
                onChange={this.handleStickerChange}
              />
              <RadioButton
                label={none}
                id="none"
                checked={selected === "none"}
                onChange={this.handleStickerChange}
              />
            </Stack>
            <br/>
            <Button
              onClick={() => this.saveSticker()}
              loading={save_loading_sticker}
              disabled={save_disabled_sticker}
              primary={true}>
                Save Sticker
            </Button>
            </Card>
            <Card sectioned title="Add or delete sticker code in theme file">
            <TextStyle><span className="italics">Add Sticker Code</span> to automatically add sticker code to your theme file or <span className="italics">Add Manually</span> if your theme is not compatible with setup.</TextStyle><br/>
            <br/>
            <Banner title="Warning"  status="warning">
              <p>Before altering your theme's code we recommend you backup your theme files.</p>
            </Banner>
            <br/>
            <div className="button-separate">
            <Stack>
            <Button
            onClick={() => this.createStickerDiv()}
            primary={true}
            loading={button_loading}
            disabled={sticker_theme}
            >
              Add Sticker Code
            </Button>
            <Button
              onClick={() => this.clearStickerDiv()}
              loading={button_loading}
              disabled={!sticker_theme}
              >
              Clear Sticker Code
            </Button>
            </Stack>
              <Button
                onClick={() => this.openStickerModal()}
                primary={true}
                loading={button_loading}
                disabled={sticker_theme}
              >
              Add Manually
            </Button>
            </div>
            <br/>
            {this.stickerThemeAdded()}
            {this.stickerThemeCleared()}
          </Card>
          <br />
          <Card sectioned title="Select a product page layout">
            <Stack>
              <RadioButton
                label={sideCol}
                id="side-col"
                checked={selectedLayout === "side-col"}
                onChange={this.handleLayoutChange}
              />
              <RadioButton
                label={insideCol}
                id="inside-col"
                checked={selectedLayout === "inside-col"}
                onChange={this.handleLayoutChange}
              />
              <RadioButton
                label={bottomPage}
                id="bottom-page"
                checked={selectedLayout === "bottom-page"}
                onChange={this.handleLayoutChange}
              />
            </Stack>
            <br />
            <TextStyle variation="strong">To Setup:</TextStyle>
            <br/>
            {this.layoutInstructions()}
            <br />
            <TextField
              value={this.layoutText()}
              multiline={4}
              readOnly={true}
              helpText = "The <!-- --> lines are only for context and should not be pasted into your liquid files"
            />
            <Button
              onClick={() => this.addLayoutTheme()}
              primary={true}
              loading={button_loading}
              disabled={layout_theme}
              >
              Add Layout Code
            </Button>
          </Card>


            <br />
          <Card sectioned title="Staff Page">
            <TextStyle variation="subdued">Automatically create a page with all your staff. Give it a title, an optional subtitle, and create your custom page.</TextStyle>
            <br />
            <br />
            <TextField
              value={this.state.page_title}
              onChange={this.handleChange.bind(this, "page_title")}
              label="Page Title"
              type="text"
              maxLength={24}
              showCharacterCount={true}
              fullWidth
            />
            <br />
            <TextField
              value={this.state.subtitle}
              onChange={this.handleChange.bind(this, "subtitle")}
              label="Subtitle (optional)"
              type="text"
              multiline={true}
              maxLength={400}
              showCharacterCount={true}
              fullWidth
            />
            <br />
            <Button
              primary={true}
              loading={title_loading}
              disabled={title_disabled}
              onClick={this.handleCreatePage}
            >Create Staff Page
          </Button>
            <br />
            {this.pageCreatedAlert()}
          </Card>
          <br/>
          <Button
            primary={true}
            loading={save_loading}
            disabled={save_disabled}
            onClick={this.handleSubmit}
          >
            Save
          </Button>
          <br />
          <br />
        </Page>
      </AppProvider>
       <AppProvider>
          <Modal
            open={sticker_modal_open}
            onClose={() => this.closeStickerModal()}
            title="Manual Sticker Setup"
          >
            <Modal.Section>
              <TextStyle variation="strong">To Setup Stickers Manually:</TextStyle>
            <br />
            <List type="number">
              <List.Item>Navigate to Online Store/Themes and in the Actions dropdown click Edit code. It is also recommended to "Download theme file" for a backup.</List.Item>
              <List.Item>Open the product-card-grid liquid file, or the file that displays the product on collection pages.</List.Item>
              <List.Item>Locate the img element that displays the product image.</List.Item>
              <List.Item>Copy and paste the staff-pick-alert div directly beneath the img element.</List.Item>
               <TextField
              value={stickerInsertion}
              multiline={2}
              readOnly={true}
              helpText="The <!-- --> line is only for context and should not be pasted into your liquid files"
              />
              <List.Item>Once you have successfully added the code to your theme, click Added to let us know.</List.Item>
            </List>
            <br />
              <Stack>
                <Button primary={true} onClick={() => this.addStickerManually()}>
                  Added
                </Button>
                <Button onClick={() => this.closeStickerModal()}>Cancel</Button>
              </Stack>
            </Modal.Section>
          </Modal>
        </AppProvider>
        </>
    );
  }
}

export default Settings;

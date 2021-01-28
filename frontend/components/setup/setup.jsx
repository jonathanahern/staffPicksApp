import React, { Component } from "react";
import {
  AppProvider,
  Page,
  Card,
  TextStyle,
} from "@shopify/polaris";

class Setup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staffColor: "positive",
      picksColor: "positive",
      stickerChoiceColor: "positive",
      stickerThemeColor: "positive",
      layoutThemeColor: "positive",
      loaded: false,
    };
    this.initialCheck = this.initialCheck.bind(this);
    this.checkTotalEmployees = this.checkTotalEmployees.bind(this);
    this.checkTotalProducts = this.checkTotalProducts.bind(this);
    this.checkStickerChoice = this.checkStickerChoice.bind(this);
    this.checkStickerTheme = this.checkStickerTheme.bind(this);
    this.checkLayoutTheme = this.checkLayoutTheme.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
      if (prevProps.employees !== this.props.employees) {
          this.checkTotalEmployees()
      } else if (prevProps.products !== this.props.products){
          this.checkTotalProducts()
      } else if (prevProps.settings.sticker !== this.props.settings.sticker){
        this.checkStickerChoice()
      } else if (prevProps.settings.sticker_theme !== this.props.settings.sticker_theme){
        this.checkStickerTheme()
      } else if (prevProps.settings.layout !== this.props.settings.layout){
        this.checkLayoutTheme()
      }
  }

  componentDidMount() {
    this.props.fetchSetting().then((data) => this.initialCheck());
    this.props.fetchEmployees().then((data) => this.checkTotalEmployees());
    this.props.fetchProducts().then((data) => this.checkTotalProducts());
  }

  checkTotalEmployees(){
    if (Object.keys(this.props.employees).length > 0){
      this.setState({ staffColor: "positive" });
    } else {
      this.setState({ staffColor: "negative" });
    }
  }

  checkTotalProducts(){
    if (Object.keys(this.props.products).length > 0){
      this.setState({ picksColor: "positive" });
    } else {
      this.setState({ picksColor: "negative" });
    }
    this.setState({ loaded: true });
  }

  initialCheck(){
    this.checkStickerChoice();
    this.checkStickerTheme();
    this.checkLayoutTheme();
  }

  checkStickerChoice(){
    if (this.props.settings.sticker !== "new"){
      this.setState({ stickerChoiceColor: "positive" });
    } else {
      this.setState({ stickerChoiceColor: "negative" });
    }
  }

  checkStickerTheme(){
    if (this.props.settings.sticker_theme){
      this.setState({ stickerThemeColor: "positive" });
    } else {
      this.setState({ stickerThemeColor: "negative" });
    }
  }

  checkLayoutTheme(){
    if (this.props.settings.layout !== "none"){
      this.setState({ layoutThemeColor: "positive" });
    } else {
      this.setState({ layoutThemeColor: "negative" });
    }
  }

  setupCheck(){
    if (this.state.loaded===true && (this.state.staffColor==="negative" || this.state.stickerChoiceColor==="negative" || this.state.picksColor==="negative" || this.state.stickerThemeColor==="negative" || this.state.layoutThemeColor==="negative")){
      return <>
      <AppProvider>
         <Page>
           <br/>
           <Card sectioned title="Setup">
               <TextStyle variation="strong">To setup the app, follow these steps in the listed tab:</TextStyle>
               <br/>
               <ul className="setup-list">
                 <li><TextStyle variation={this.state.staffColor}>Staff: Add a staff member. <span className="italics">Note: A staff's profile requires an image url. Beforehand, upload a picture to Shopify Files (Settings/Files) and copy its url. </span></TextStyle><br/></li>
                 <li><TextStyle variation={this.state.picksColor}>Picks: Add a pick.</TextStyle><br/></li>
                 <li><TextStyle variation={this.state.stickerChoiceColor}>Settings: Select a sticker to place on your picks in the collection pages.</TextStyle><br/></li>
                 <li><TextStyle variation={this.state.stickerThemeColor}>Settings: Add the sticker code to your theme file.</TextStyle><br/></li>
                 <li><TextStyle variation={this.state.layoutThemeColor}>Settings: Select a layout for the product page and then add the layout code to your theme file. <span className="italics">Add Automatically</span> to allow the app to add code to your theme file or <span className="italics">Add Manually</span> for coding instructions if your theme is not compatible with setup.</TextStyle><br/></li>
               </ul>
           </Card>
         </Page>
       </AppProvider>
      </>;
    } else {
      return <></>;
    }  
  }


  render() {
    
    return (<>
      {this.setupCheck()}
      </>
    );
  }
}

export default Setup;
